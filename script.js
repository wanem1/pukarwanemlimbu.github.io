// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active")
  navMenu.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active")
    navMenu.classList.remove("active")
  }),
)

// Portfolio Filter Functionality
const filterButtons = document.querySelectorAll(".filter-btn")
const portfolioItems = document.querySelectorAll(".portfolio-item")

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("active"))
    // Add active class to clicked button
    button.classList.add("active")

    const filterValue = button.getAttribute("data-filter")

    portfolioItems.forEach((item) => {
      if (filterValue === "all") {
        item.classList.remove("hidden")
        setTimeout(() => {
          item.style.display = "block"
        }, 300)
      } else {
        const itemCategory = item.getAttribute("data-category")
        if (itemCategory === filterValue) {
          item.classList.remove("hidden")
          setTimeout(() => {
            item.style.display = "block"
          }, 300)
        } else {
          item.classList.add("hidden")
          setTimeout(() => {
            item.style.display = "none"
          }, 300)
        }
      }
    })
  })
})

// Smooth scrolling for navigation links
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

// Intersection Observer for Timeline Animation
const timelineItems = document.querySelectorAll(".timeline-item")
const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate")
      }
    })
  },
  {
    threshold: 0.3,
    rootMargin: "0px 0px -50px 0px",
  },
)

timelineItems.forEach((item) => {
  timelineObserver.observe(item)
})

// Parallax effect for floating shapes
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const shapes = document.querySelectorAll(".shape")

  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 0.5
    shape.style.transform = `translateY(${scrolled * speed}px)`
  })
})

// Contact form handling
const contactForm = document.querySelector(".contact-form")
contactForm.addEventListener("submit", (e) => {
  e.preventDefault()

  // Get form data
  const formData = new FormData(contactForm)
  const name = formData.get("name")
  const email = formData.get("email")
  const subject = formData.get("subject")
  const message = formData.get("message")

  // Simple validation
  if (!name || !email || !subject || !message) {
    alert("Please fill in all fields")
    return
  }

  // Simulate form submission
  const submitBtn = contactForm.querySelector(".btn-primary")
  const originalText = submitBtn.textContent
  submitBtn.textContent = "Sending..."
  submitBtn.disabled = true

  setTimeout(() => {
    alert("Thank you for your message! I'll get back to you soon.")
    contactForm.reset()
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }, 2000)
})

// Add scroll effect to navbar
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(10, 10, 10, 0.98)"
  } else {
    navbar.style.background = "rgba(10, 10, 10, 0.95)"
  }
})

// Portfolio item hover effects
portfolioItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    item.style.transform = "translateY(-10px) scale(1.02)"
  })

  item.addEventListener("mouseleave", () => {
    item.style.transform = "translateY(0) scale(1)"
  })
})

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")
})

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
  let i = 0
  element.innerHTML = ""

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i)
      i++
      setTimeout(type, speed)
    }
  }

  type()
}

// Initialize animations on page load
document.addEventListener("DOMContentLoaded", () => {
  // Add stagger animation to portfolio items
  portfolioItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`
  })

  // Add intersection observer for portfolio items
  const portfolioObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    },
    {
      threshold: 0.1,
    },
  )

  portfolioItems.forEach((item) => {
    portfolioObserver.observe(item)
  })
})
