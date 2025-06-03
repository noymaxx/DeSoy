/**
 * Manages environment variables with type safety and validation
 */
class EnvManager {
  /**
   * Gets an environment variable or throws if not found
   * @param key Environment variable key
   * @returns Environment variable value
   * @throws Error if environment variable is not set
   */
  static getEnvOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
  }

  /**
   * Gets an environment variable with a default value
   * @param key Environment variable key
   * @param defaultValue Default value if environment variable is not set
   * @returns Environment variable value or default value
   */
  static getEnvOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
  }

  /**
   * Gets a boolean environment variable
   * @param key Environment variable key
   * @param defaultValue Default value if environment variable is not set
   * @returns Boolean value of environment variable
   */
  static getEnvBool(key: string, defaultValue = false): boolean {
    const value = process.env[key];
    if (!value) return defaultValue;
    return ['true', '1', 'yes'].includes(value.toLowerCase());
  }

  /**
   * Gets a number environment variable
   * @param key Environment variable key
   * @param defaultValue Default value if environment variable is not set
   * @returns Number value of environment variable
   */
  static getEnvNumber(key: string, defaultValue: number): number {
    const value = process.env[key];
    if (!value) return defaultValue;
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  }
}

export default EnvManager; 