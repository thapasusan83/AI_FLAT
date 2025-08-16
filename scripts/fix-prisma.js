const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🔧 Fixing Prisma client generation...")

try {
  // Ensure node_modules exists
  if (!fs.existsSync("node_modules")) {
    console.log("📦 Installing dependencies...")
    execSync("npm install", { stdio: "inherit" })
  }

  // Generate Prisma client
  console.log("🔄 Generating Prisma client...")
  execSync("npx prisma generate", { stdio: "inherit" })

  // Check if client was generated
  const clientPath = path.join("node_modules", "@prisma", "client")
  if (fs.existsSync(clientPath)) {
    console.log("✅ Prisma client generated successfully!")
  } else {
    console.log("⚠️  Prisma client generation may have failed")
  }
} catch (error) {
  console.error("❌ Error fixing Prisma:", error.message)
  console.log("💡 Try running: npm install && npx prisma generate")
}
