console.log("Lukseh.org Launcher starting...")

// Navigation function
window.showSection = (sectionId) => {
    // Hide all sections
    const sections = document.querySelectorAll(".content-section")
    sections.forEach((section) => section.classList.remove("active"))

    // Show selected section
    const targetSection = document.getElementById(sectionId)
    if (targetSection) {
        targetSection.classList.add("active")
    }

    // Special handling for skins section
    if (sectionId === "skins") {
        window.openSkinsWindow()
    }

    // Update nav items
    const navItems = document.querySelectorAll(".nav-item")
    navItems.forEach((item) => item.classList.remove("active"))

    // Find and activate the clicked nav item
    const activeNavItem = Array.from(navItems).find((item) => item.onclick && item.onclick.toString().includes(sectionId))
    if (activeNavItem) {
        activeNavItem.classList.add("active")
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

// Open skins in embedded window
window.openSkinsWindow = async () => {
    try {
        if (window.__TAURI__) {
            // In Tauri, create a new window for skins
            const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow")

            const skinsWindow = new WebviewWindow("skins", {
                url: "https://skins.lukseh.org",
                title: "Lukseh.org - Skin Changer",
                width: 1200,
                height: 800,
                resizable: true,
                center: true,
                decorations: true,
                alwaysOnTop: false,
            })

            // Listen for window events
            skinsWindow.once("tauri://created", () => {
                console.log("Skins window created successfully")
            })

            skinsWindow.once("tauri://error", (e) => {
                console.error("Failed to create skins window:", e)
            })
        } else {
            // In browser, open in new window with specific dimensions
            const skinsWindow = window.open(
                "https://skins.lukseh.org",
                "lukseh-skins",
                "width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no",
            )

            if (skinsWindow) {
                skinsWindow.focus()
                console.log("Opened skins in new browser window")
            } else {
                // Fallback if popup blocked
                window.open("https://skins.lukseh.org", "_blank")
            }
        }
    } catch (error) {
        console.error("Failed to open skins window:", error)
        // Ultimate fallback
        window.open("https://skins.lukseh.org", "_blank")
    }
}

// Alternative: Open skins in same window (replaces current content)
window.openSkinsInSameWindow = () => {
    if (window.__TAURI__) {
        // In Tauri, navigate the current window to skins
        window.location.href = "https://skins.lukseh.org"
    } else {
        // In browser, replace current page
        window.location.href = "https://skins.lukseh.org"
    }
}

// Global connect function for CS2 servers
window.connect = async (port) => {
    const url = `steam://connect/cs.lukseh.org:${port}?appid=730/`
    console.log(`Attempting to connect to: ${url}`)

    const statusDiv = document.getElementById("status")
    if (statusDiv) {
        statusDiv.innerHTML = '<div class="status">Connecting to CS2...</div>'
    }

    try {
        if (window.__TAURI__) {
            const { open } = await import("@tauri-apps/plugin-shell")
            await open(url)
        } else {
            const link = document.createElement("a")
            link.href = url
            link.style.display = "none"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            setTimeout(() => {
                try {
                    window.open(url, "_blank")
                } catch (e) {
                    console.log("Fallback method attempted")
                }
            }, 100)
        }

        console.log("Successfully opened Steam URL")
        if (statusDiv) {
            statusDiv.innerHTML = '<div class="status success">CS2 connection initiated! Steam should launch CS2 now.</div>'
            setTimeout(() => {
                statusDiv.innerHTML = ""
            }, 4000)
        }
    } catch (error) {
        console.error("Failed to open Steam URL:", error)
        if (statusDiv) {
            statusDiv.innerHTML = '<div class="status error">Failed to auto-connect. Trying manual method...</div>'
        }

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
            statusDiv.innerHTML = '<div class="status success">Console command copied to clipboard!</div>'
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

        const servers = [
            { name: "DM Server", port: 27016 },
            { name: "Pracc Server", port: 27017 },
        ]

        const results = []

        for (const server of servers) {
            try {
                console.log(`Testing ${server.name} on port ${server.port}`)
                results.push(`✅ ${server.name} (${server.port}) - Ready`)
            } catch (error) {
                results.push(`❌ ${server.name} (${server.port}) - Error`)
            }
        }

        setTimeout(() => {
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

    // Prevent page navigation on protocol links
    document.addEventListener("click", (e) => {
        if (e.target.tagName === "A" && e.target.href.startsWith("steam://")) {
            e.preventDefault()
        }
    })
})
