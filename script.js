// Mobile Navigation
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")
const navLinks = document.querySelectorAll(".nav-link")

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active")
  navMenu.classList.toggle("active")
})

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active")
    navMenu.classList.remove("active")
  })
})

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Active Navigation Link
window.addEventListener("scroll", () => {
  let current = ""
  const sections = document.querySelectorAll("section")

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
})

// Skills Animation
const animateSkills = () => {
  const skillItems = document.querySelectorAll(".skill-item")

  skillItems.forEach((item) => {
    const rect = item.getBoundingClientRect()
    if (rect.top < window.innerHeight - 100) {
      const skillLevel = item.getAttribute("data-skill")
      const progressBar = item.querySelector(".skill-progress")

      setTimeout(() => {
        progressBar.style.width = `${skillLevel}%`
      }, 200)
    }
  })
}

window.addEventListener("scroll", animateSkills)
window.addEventListener("load", animateSkills)

// Timeline Animation
const timelineItems = document.querySelectorAll(".timeline-item")
const timelineProgressLine = document.querySelector(".timeline-progress-line")

const animateTimeline = () => {
  const timelineSection = document.querySelector(".timeline-section")
  const rect = timelineSection.getBoundingClientRect()

  if (rect.top < window.innerHeight && rect.bottom > 0) {
    // Calculate progress based on scroll position
    const progress = Math.min(
      100,
      Math.max(0, ((window.innerHeight - rect.top) / (window.innerHeight + rect.height)) * 100),
    )

    timelineProgressLine.style.height = `${progress}%`

    // Animate timeline items
    timelineItems.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect()
      if (itemRect.top < window.innerHeight - 100) {
        setTimeout(() => {
          item.classList.add("animate")
        }, index * 300)
      }
    })
  }
}

window.addEventListener("scroll", animateTimeline)
window.addEventListener("load", animateTimeline)

// Portfolio Filter
const filterButtons = document.querySelectorAll(".filter-btn")
const portfolioItems = document.querySelectorAll(".portfolio-item")

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("active"))
    // Add active class to clicked button
    button.classList.add("active")

    const filterValue = button.getAttribute("data-filter")

    portfolioItems.forEach((item, index) => {
      if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
        setTimeout(() => {
          item.classList.remove("hidden")
        }, index * 100)
      } else {
        item.classList.add("hidden")
      }
    })
  })
})

// Contact Form
const contactForm = document.querySelector(".contact-form")

contactForm.addEventListener("submit", (e) => {
  e.preventDefault()

  // Get form data
  const name = contactForm.querySelector('input[type="text"]').value
  const email = contactForm.querySelector('input[type="email"]').value
  const subject = contactForm.querySelector('input[placeholder="Subject"]').value
  const message = contactForm.querySelector("textarea").value

  // Simple validation
  if (!name || !email || !subject || !message) {
    alert("Please fill in all fields")
    return
  }

  // Simulate form submission with loading state
  const submitBtn = contactForm.querySelector(".btn")
  const originalText = submitBtn.innerHTML

  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>'
  submitBtn.disabled = true

  setTimeout(() => {
    alert("Thank you for your message! I will get back to you soon.")
    contactForm.reset()
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
  }, 2000)
})

// Download Model Function
const downloadButtons = document.querySelectorAll(".download-btn")

downloadButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const modelCard = e.target.closest(".model-card")
    const modelName = modelCard.querySelector("h3").textContent

    // Add download animation
    const originalContent = button.innerHTML
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Downloading...</span>'
    button.disabled = true

    setTimeout(() => {
      button.innerHTML = '<i class="fas fa-check"></i> <span>Downloaded!</span>'
      button.style.background = "linear-gradient(135deg, #10b981, #059669)"

      setTimeout(() => {
        button.innerHTML = originalContent
        button.style.background = ""
        button.disabled = false
      }, 2000)
    }, 1500)

    // Simulate download
    console.log(`Downloading ${modelName}...`)
  })
})

// Scroll Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe elements for animation
document.querySelectorAll(".portfolio-item, .model-card, .contact-item, .hero-card").forEach((el) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(30px)"
  el.style.transition = "opacity 0.8s ease, transform 0.8s ease"
  observer.observe(el)
})

// Navbar Background on Scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)"
    navbar.style.boxShadow = "0 5px 30px rgba(0, 0, 0, 0.1)"
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)"
    navbar.style.boxShadow = "none"
  }
})

// Typing Effect for Hero Title
const heroTitle = document.querySelector(".hero-title .gradient-text")
if (heroTitle) {
  const originalText = heroTitle.textContent
  heroTitle.textContent = ""

  let i = 0
  const typeWriter = () => {
    if (i < originalText.length) {
      heroTitle.textContent += originalText.charAt(i)
      i++
      setTimeout(typeWriter, 100)
    }
  }

  // Start typing effect when page loads
  window.addEventListener("load", () => {
    setTimeout(typeWriter, 1000)
  })
}

// Parallax Effect for Hero Section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const heroBackground = document.querySelector(".hero-background")

  if (heroBackground) {
    const speed = scrolled * 0.3
    heroBackground.style.transform = `translateY(${speed}px)`
  }
})

// Interactive Skill Hover Effects
document.querySelectorAll(".skill-item").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    const progressBar = item.querySelector(".skill-progress")
    progressBar.style.background = "linear-gradient(135deg, #06b6d4, #8b5cf6)"
  })

  item.addEventListener("mouseleave", () => {
    const progressBar = item.querySelector(".skill-progress")
    progressBar.style.background = "var(--gradient-primary)"
  })
})

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")

  // Trigger initial animations
  setTimeout(() => {
    animateSkills()
    animateTimeline()
  }, 500)
})

// Smooth reveal animations for sections
const revealSections = () => {
  const sections = document.querySelectorAll("section")

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect()
    if (rect.top < window.innerHeight - 100) {
      section.style.opacity = "1"
      section.style.transform = "translateY(0)"
    }
  })
}

// Initialize section animations
document.querySelectorAll("section").forEach((section) => {
  section.style.opacity = "0"
  section.style.transform = "translateY(30px)"
  section.style.transition = "opacity 1s ease, transform 1s ease"
})

window.addEventListener("scroll", revealSections)
window.addEventListener("load", revealSections)

// Add dynamic cursor effect
document.addEventListener("mousemove", (e) => {
  const cursor = document.querySelector(".cursor")
  if (!cursor) {
    const newCursor = document.createElement("div")
    newCursor.className = "cursor"
    newCursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--gradient-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            opacity: 0.7;
        `
    document.body.appendChild(newCursor)
  }

  const cursorElement = document.querySelector(".cursor")
  cursorElement.style.left = e.clientX - 10 + "px"
  cursorElement.style.top = e.clientY - 10 + "px"
})

// Enhanced button interactions
document.querySelectorAll(".btn, .filter-btn, .download-btn").forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    btn.style.transform = "translateY(-3px) scale(1.05)"
  })

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translateY(0) scale(1)"
  })
})

console.log("Portfolio website loaded successfully! 🚀")
