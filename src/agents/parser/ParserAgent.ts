/**
 * Solidity Parser Sub-Agent
 * Parses Solidity source code into AST and extracts contract metadata
 */

import * as parser from '@solidity-parser/parser';
import {
  ParsedContract,
  ContractMetadata,
  FunctionInfo,
  StateVariable,
  EventInfo,
  ModifierInfo,
  ExternalCall,
  CodeLocation,
  Parameter
} from '../../types';
import { logger } from '../../utils/logger';

export class ParserAgent {
  /**
   * Parse Solidity source code and extract metadata
   */
  async parse(sourceCode: string): Promise<ParsedContract> {
    logger.info('Starting Solidity code parsing');

    try {
      // Parse source code to AST
      const ast = parser.parse(sourceCode, {
        loc: true,
        range: true,
        tolerant: true
      });

      // Extract contract metadata
      const metadata = this.extractMetadata(ast, sourceCode);

      logger.info(`Successfully parsed ${metadata.length} contract(s)`);

      return {
        ast,
        sourceCode,
        metadata
      };
    } catch (error: any) {
      logger.error('Failed to parse Solidity code', { error: error.message });
      throw new Error(`Parsing failed: ${error.message}`);
    }
  }

  /**
   * Extract contract metadata from AST
   */
  private extractMetadata(ast: any, sourceCode: string): ContractMetadata[] {
    const contracts: ContractMetadata[] = [];

    try {
      parser.visit(ast, {
        ContractDefinition: (node: any) => {
          const metadata: ContractMetadata = {
            name: node.name || 'Unknown',
            inheritance: this.extractInheritance(node),
            functions: [],
            stateVariables: [],
            events: [],
            modifiers: [],
            externalCalls: []
          };

          // Extract functions
          if (node.subNodes && Array.isArray(node.subNodes)) {
            for (const subNode of node.subNodes) {
              try {
                if (!subNode || !subNode.type) continue;

                if (subNode.type === 'FunctionDefinition') {
                  metadata.functions.push(this.extractFunction(subNode));
                  metadata.externalCalls.push(...this.extractExternalCalls(subNode));
                } else if (subNode.type === 'StateVariableDeclaration') {
                  metadata.stateVariables.push(...this.extractStateVariables(subNode));
                } else if (subNode.type === 'EventDefinition') {
                  metadata.events.push(this.extractEvent(subNode));
                } else if (subNode.type === 'ModifierDefinition') {
                  metadata.modifiers.push(this.extractModifier(subNode));
                }
              } catch (err) {
                logger.warn('Failed to extract subNode', { error: (err as any).message });
              }
            }
          }

          contracts.push(metadata);
        }
      });
    } catch (error) {
      logger.error('Failed to extract metadata', { error: (error as any).message });
    }

    return contracts;
  }

  /**
   * Extract contract inheritance
   */
  private extractInheritance(node: any): string[] {
    if (!node.baseContracts) return [];
    return node.baseContracts.map((base: any) => base.baseName.namePath);
  }

  /**
   * Extract function information
   */
  private extractFunction(node: any): FunctionInfo {
    return {
      name: node.name || '<fallback>',
      visibility: node.visibility || 'public',
      modifiers: node.modifiers?.map((m: any) => m.name) || [],
      parameters: this.extractParameters(node.parameters),
      returnTypes: this.extractParameters(node.returnParameters || []).map(p => p.type),
      stateMutability: node.stateMutability || 'nonpayable',
      location: this.extractLocation(node)
    };
  }

  /**
   * Extract state variables
   */
  private extractStateVariables(node: any): StateVariable[] {
    const variables: StateVariable[] = [];

    if (node.variables) {
      for (const variable of node.variables) {
        variables.push({
          name: variable.name,
          type: this.getTypeName(variable.typeName),
          visibility: variable.visibility || 'internal',
          location: this.extractLocation(variable),
          initialized: !!variable.expression
        });
      }
    }

    return variables;
  }

  /**
   * Extract event information
   */
  private extractEvent(node: any): EventInfo {
    return {
      name: node.name,
      parameters: this.extractParameters(node.parameters),
      location: this.extractLocation(node)
    };
  }

  /**
   * Extract modifier information
   */
  private extractModifier(node: any): ModifierInfo {
    return {
      name: node.name,
      parameters: this.extractParameters(node.parameters || []),
      location: this.extractLocation(node)
    };
  }

  /**
   * Extract function parameters
   */
  private extractParameters(params: any): Parameter[] {
    if (!params || !Array.isArray(params)) return [];

    return params.map((param: any) => ({
      name: param.name || '',
      type: this.getTypeName(param.typeName)
    }));
  }

  /**
   * Extract external calls from function body
   */
  private extractExternalCalls(node: any): ExternalCall[] {
    const calls: ExternalCall[] = [];

    if (!node.body) return calls;

    const visitNode = (n: any) => {
      if (n.type === 'FunctionCall') {
        const expr = n.expression;
        if (expr && expr.type === 'MemberAccess') {
          const memberName = expr.memberName;
          if (['call', 'delegatecall', 'send', 'transfer'].includes(memberName)) {
            calls.push({
              type: memberName as any,
              location: this.extractLocation(n),
              checked: this.isReturnValueChecked(n)
            });
          }
        }
      }

      // Recursively visit child nodes
      for (const key in n) {
        if (n[key] && typeof n[key] === 'object') {
          if (Array.isArray(n[key])) {
            n[key].forEach(visitNode);
          } else {
            visitNode(n[key]);
          }
        }
      }
    };

    visitNode(node.body);
    return calls;
  }

  /**
   * Check if return value is checked
   */
  private isReturnValueChecked(node: any): boolean {
    // Simplified check - in production, would need more sophisticated analysis
    return false;
  }

  /**
   * Get type name as string
   */
  private getTypeName(typeName: any): string {
    if (!typeName) return 'unknown';

    if (typeof typeName === 'string') return typeName;

    if (typeName.type === 'ElementaryTypeName') {
      return typeName.name;
    } else if (typeName.type === 'UserDefinedTypeName') {
      return typeName.namePath;
    } else if (typeName.type === 'Mapping') {
      return `mapping(${this.getTypeName(typeName.keyType)} => ${this.getTypeName(typeName.valueType)})`;
    } else if (typeName.type === 'ArrayTypeName') {
      return `${this.getTypeName(typeName.baseTypeName)}[]`;
    }

    return 'unknown';
  }

  /**
   * Extract code location from node
   */
  private extractLocation(node: any): CodeLocation {
    return {
      file: 'contract.sol',
      line: node.loc?.start?.line || 0,
      column: node.loc?.start?.column || 0,
      functionName: node.name,
      contractName: undefined
    };
  }
}
