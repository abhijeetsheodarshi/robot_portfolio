import fs from 'fs';
import path from 'path';

const distDir = 'dist';
if (fs.existsSync(distDir)) {
  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

  // Copy index.html as 404.html for SPA static servers like GitHub Pages
  fs.writeFileSync(path.join(distDir, '404.html'), indexHtml);

  console.log('Post-build static route files created successfully!');
}
