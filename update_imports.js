const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./src', function(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Replace import Link from 'next/link' (or double quotes)
    content = content.replace(/import\s+(\w+)?\s*(,\s*\{[^}]+\})?\s*from\s+['"]next\/link['"];?/g, (match, def, named) => {
        if(def === 'Link') return `import { Link } from "@/i18n/routing";`;
        return match;
    });

    // Replace next/navigation imports (useRouter, usePathname, redirect)
    // Note: notFound still needs to be from next/navigation
    const navigationMatch = content.match(/import\s*\{([^}]+)\}\s*from\s+['"]next\/navigation['"];?/);
    if(navigationMatch) {
        const importedItems = navigationMatch[1].split(',').map(i => i.trim());
        const i18nItems = importedItems.filter(i => ['useRouter', 'usePathname', 'redirect'].includes(i));
        const nextItems = importedItems.filter(i => !['useRouter', 'usePathname', 'redirect'].includes(i));
        
        let newImports = '';
        if(i18nItems.length > 0) {
            newImports += `import { ${i18nItems.join(', ')} } from "@/i18n/routing";\n`;
        }
        if(nextItems.length > 0) {
            newImports += `import { ${nextItems.join(', ')} } from "next/navigation";\n`;
        }
        
        content = content.replace(navigationMatch[0], newImports.trim());
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
    }
});
