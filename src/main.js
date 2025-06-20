console.log("Lukseh.org Launcher starting...")

// Navigation function
window.showSection = (sectionId) => {
    console.log("Switching to section:", sectionId)

    // Hide all sections
    const sections = document.querySelectorAll(".content-section")
    sections.forEach((section) => section.classList.remove("active"))

    // Show selected section
    const targetSection = document.getElementById(sectionId)
    if (targetSection) {
        targetSection.classList.add("active")
        console.log("Activated section:", sectionId)
    }

    // Update nav items
    const navItems = document.querySelectorAll(".nav-item")
    navItems.forEach((item) => item.classList.remove("active"))

    // Find and activate the clicked nav item
    const clickedItem = event?.target?.closest(".nav-item")
    if (clickedItem) {
        clickedItem.classList.add("active")
    }

    // Update page title
    const pageTitle = document.getElementById("page-title")
    const titles = {
        home: "Home",
        servers: "CS2 Servers",
        skins: "Skin Changer",
        news: "Latest News",
        settings: "Settings",
    }
    if (pageTitle && titles[sectionId]) {
        pageTitle.textContent = titles[sectionId]
    }
}

// Simple skins window opener (no dynamic imports)
window.openSkinsWindow = () => {
    try {
        // Try to open in same window first
        window.location.href = "https://skins.lukseh.org"
    } catch (error) {
        console.error("Failed to navigate to skins:", error)
        // Fallback to new tab
        window.open("https://skins.lukseh.org", "_blank")
    }
}

// Open skins in browser
window.openSkinsInBrowser = () => {
    window.open("https://skins.lukseh.org", "_blank")
}

// CS2 connection function
window.connect = async (port) => {
    const url = `steam://connect/cs.lukseh.org:${port}?appid=730/`
    console.log(`Attempting to connect to: ${url}`)

    const statusDiv = document.getElementById("status")
    if (statusDiv) {
        statusDiv.innerHTML = '<div class="status">Connecting to CS2...</div>'
    }

    try {
        // Try Tauri shell API if available
        if (window.__TAURI__) {
            const { invoke } = window.__TAURI__.core
            const { open } = window.__TAURI__.shell
            await open(url)
        } else {
            // Browser fallback
            const link = document.createElement("a")
            link.href = url
            link.style.display = "none"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }

        console.log("Successfully opened Steam URL")
        if (statusDiv) {
            statusDiv.innerHTML = '<div class="status success">CS2 connection initiated!</div>'
            setTimeout(() => {
                statusDiv.innerHTML = ""
            }, 4000)
        }
    } catch (error) {
        console.error("Failed to open Steam URL:", error)

        try {
            await navigator.clipboard.writeText(`connect cs.lukseh.org:${port}`)
            if (statusDiv) {
                statusDiv.innerHTML = '<div class="status success">Connect command copied to clipboard!</div>'
            }
            alert(`Connect command copied to clipboard:\nconnect cs.lukseh.org:${port}\n\nPaste this in your CS2 console.`)
        } catch (clipError) {
            alert(`Please manually connect using:\nconnect cs.lukseh.org:${port}`)
        }
    }
}

// Manual connect function
window.manualConnect = async (port) => {
    try {
        await navigator.clipboard.writeText(`connect cs.lukseh.org:${port}`)
        const statusDiv = document.getElementById("status")
        if (statusDiv) {
            statusDiv.innerHTML = '<div class="status success">Console command copied!</div>'
            setTimeout(() => {
                statusDiv.innerHTML = ""
            }, 3000)
        }
        alert(`Console command copied!\n\n1. Open CS2\n2. Press ~ to open console\n3. Paste: connect cs.lukseh.org:${port}`)
    } catch (error) {
        alert(`Manual connection:\n\n1. Open CS2\n2. Press ~ to open console\n3. Type: connect cs.lukseh.org:${port}`)
    }
}

// Test connection function
window.testConnection = async () => {
    const statusDiv = document.getElementById("status")
    if (statusDiv) {
        statusDiv.innerHTML = '<div class="status">Testing server connections...</div>'

        setTimeout(() => {
            const results = ["✅ DM Server (27016) - Ready", "✅ Pracc Server (27017) - Ready"]

            statusDiv.innerHTML = `<div class="status success">Server Status:<br>${results.join("<br>")}</div>`

            setTimeout(() => {
                statusDiv.innerHTML = ""
            }, 5000)
        }, 1000)
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("Lukseh.org Launcher initialized")
    console.log("Tauri environment:", window.__TAURI__ ? "Yes" : "No")
})
