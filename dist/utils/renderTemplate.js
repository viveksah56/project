import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const renderTemplate = (templateName, variables) => {
    const templatePath = path.join(__dirname, "../views/emails", `${templateName}.html`);
    let html = fs.readFileSync(templatePath, "utf-8");
    Object.entries(variables).forEach(([key, value]) => {
        html = html.replaceAll(`{{${key}}}`, value);
    });
    return html;
};
//# sourceMappingURL=renderTemplate.js.map