export interface ScriptInfo {
  src?: string;
  type?: string;
  async?: boolean;
  defer?: boolean;
  crossorigin?: string;
  integrity?: string;
  content?: string;
  id?: string;
}

export interface ParsedScript {
  external: ScriptInfo[];
  inline: ScriptInfo[];
}

export class ScriptManager {
  private loadedScripts = new Set<string>();
  private scriptElements = new Map<string, HTMLScriptElement>();

  static parseScripts(content: string): ParsedScript {
    const external: ScriptInfo[] = [];
    const inline: ScriptInfo[] = [];

    const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
    let match;

    while ((match = scriptRegex.exec(content)) !== null) {
      const attributes = match[1];
      const scriptContent = match[2].trim();

      const scriptInfo: ScriptInfo = {};

      const srcMatch = attributes.match(/src\s*=\s*["']([^"']+)["']/);
      if (srcMatch) {
        scriptInfo.src = srcMatch[1];
      }

      const typeMatch = attributes.match(/type\s*=\s*["']([^"']+)["']/);
      if (typeMatch) {
        scriptInfo.type = typeMatch[1];
      }

      const asyncMatch = attributes.match(/\basync\b/);
      if (asyncMatch) {
        scriptInfo.async = true;
      }

      const deferMatch = attributes.match(/\bdefer\b/);
      if (deferMatch) {
        scriptInfo.defer = true;
      }

      const crossoriginMatch = attributes.match(
        /crossorigin\s*=\s*["']([^"']+)["']/,
      );
      if (crossoriginMatch) {
        scriptInfo.crossorigin = crossoriginMatch[1];
      }

      const integrityMatch = attributes.match(
        /integrity\s*=\s*["']([^"']+)["']/,
      );
      if (integrityMatch) {
        scriptInfo.integrity = integrityMatch[1];
      }

      const idMatch = attributes.match(/id\s*=\s*["']([^"']+)["']/);
      if (idMatch) {
        scriptInfo.id = idMatch[1];
      }

      if (scriptInfo.src) {
        external.push(scriptInfo);
      } else if (scriptContent) {
        scriptInfo.content = scriptContent;
        inline.push(scriptInfo);
      }
    }

    return { external, inline };
  }

  static removeScriptsFromContent(content: string): string {
    return content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  }

  static isValidExternalScript(src: string): boolean {
    try {
      const url = new URL(src);
      const allowedProtocols = ["https:", "http:"];
      const trustedDomains = [
        "cdn.jsdelivr.net",
        "unpkg.com",
        "cdnjs.cloudflare.com",
        "code.jquery.com",
        "stackpath.bootstrapcdn.com",
      ];

      if (!allowedProtocols.includes(url.protocol)) {
        return false;
      }

      return trustedDomains.some(
        (domain) =>
          url.hostname === domain || url.hostname.endsWith(`.${domain}`),
      );
    } catch {
      return false;
    }
  }

  async loadScript(scriptInfo: ScriptInfo): Promise<void> {
    if (scriptInfo.src) {
      return this.loadExternalScript(scriptInfo);
    } else if (scriptInfo.content) {
      return this.loadInlineScript(scriptInfo);
    }
  }

  private async loadExternalScript(scriptInfo: ScriptInfo): Promise<void> {
    const { src } = scriptInfo;
    if (!src) return;

    if (!ScriptManager.isValidExternalScript(src)) {
      console.warn(
        `[ScriptManager] External script blocked for security: ${src}`,
      );
      return;
    }

    const scriptId = scriptInfo.id || `script-${src}`;

    if (this.loadedScripts.has(scriptId)) {
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");

      script.src = src;
      if (scriptInfo.type) script.type = scriptInfo.type;
      if (scriptInfo.async) script.async = true;
      if (scriptInfo.defer) script.defer = true;
      if (scriptInfo.crossorigin) script.crossOrigin = scriptInfo.crossorigin;
      if (scriptInfo.integrity) script.integrity = scriptInfo.integrity;
      if (scriptInfo.id) script.id = scriptInfo.id;

      script.onload = () => {
        this.loadedScripts.add(scriptId);
        this.scriptElements.set(scriptId, script);
        console.log(`[ScriptManager] Loaded external script: ${src}`);
        resolve();
      };

      script.onerror = () => {
        console.error(`[ScriptManager] Failed to load script: ${src}`);
        reject(new Error(`Failed to load script: ${src}`));
      };

      document.head.appendChild(script);
    });
  }

  private async loadInlineScript(scriptInfo: ScriptInfo): Promise<void> {
    const { content, id } = scriptInfo;
    if (!content) return;

    const scriptId = id || `inline-script-${Date.now()}`;

    if (this.loadedScripts.has(scriptId)) {
      return;
    }

    const script = document.createElement("script");
    if (scriptInfo.type) script.type = scriptInfo.type;
    if (scriptInfo.id) script.id = scriptInfo.id;
    script.textContent = content;

    document.head.appendChild(script);
    this.loadedScripts.add(scriptId);
    this.scriptElements.set(scriptId, script);

    console.log(`[ScriptManager] Loaded inline script: ${scriptId}`);
  }

  cleanup(): void {
    for (const [scriptId, element] of this.scriptElements) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.loadedScripts.delete(scriptId);
    }
    this.scriptElements.clear();
  }

  async loadScripts(scripts: ParsedScript): Promise<void> {
    const allScripts = [...scripts.external, ...scripts.inline];

    for (const script of allScripts) {
      try {
        await this.loadScript(script);
      } catch (error) {
        console.error("[ScriptManager] Failed to load script:", error);
      }
    }
  }
}

export const globalScriptManager = new ScriptManager();
