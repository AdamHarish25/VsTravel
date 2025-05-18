// Form validation for VS Travel booking form
document.addEventListener("DOMContentLoaded", () => {
  // Get form elements
  const submitButton = document.querySelector(".btn-kirim")
  const fullNameInput = document.getElementById("nama-lengkap")
  const phoneInput = document.getElementById("nomor-telepon")
  const locationInput = document.getElementById("tempat")
  const departureInput = document.getElementById("dari")
  const departureDate = document.getElementById("tanggal-berangkat")
  const returnDate = document.getElementById("tanggal-kembali")
  const totalPassengers = document.getElementById("jumlah-penumpang")
  const adultPassengers = document.getElementById("dewasa")
  const childPassengers = document.getElementById("anak")
  const flightClass = document.getElementById("kelas-penerbangan")
  const insuranceCheckbox = document.getElementById("asuransi")
  const specialMealCheckbox = document.getElementById("makanan-khusus")

  // Error message container
  let errorContainer = document.getElementById("error-container")
  if (!errorContainer) {
    errorContainer = document.createElement("div")
    errorContainer.id = "error-container"
    errorContainer.className = "error"

    // Make sure error container is already in the DOM
    const existingContainer = document.getElementById("error-container")
    if (!existingContainer) {
      // Insert after the button if not already in DOM
      const submitBtn = document.querySelector(".btn-kirim")
      submitBtn.insertAdjacentElement("afterend", errorContainer)
    }
  }

  // Initialize date pickers
  const dateInputs = document.querySelectorAll("#tanggal-berangkat, #tanggal-kembali")
  dateInputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.type = "date"
    })

    input.addEventListener("blur", function () {
      if (!this.value) {
        this.type = "text"
      }
    })
  })

  // Form submission handler
  submitButton.addEventListener("click", (event) => {
    // Prevent default behavior
    event.preventDefault()

    // Clear previous error messages
    errorContainer.innerHTML = ""
    errorContainer.style.display = "none"
    errorContainer.className = "error" // Reset to error class

    // Reset all input borders
    const allInputs = document.querySelectorAll(".form-group input, .form-group select")
    allInputs.forEach((input) => {
      input.classList.remove("error-input")
    })

    // Array to collect error messages
    const errors = []

    // 1. VALIDATION TYPE 1: Required Field Validation
    if (
      !validateRequiredFields(
        fullNameInput,
        phoneInput,
        locationInput,
        departureInput,
        departureDate,
        totalPassengers,
        adultPassengers,
        flightClass,
      )
    ) {
      errors.push("Harap isi semua bidang yang wajib diisi.")
    }

    // 2. VALIDATION TYPE 2: Text Input Validation (Name)
    const nameValidation = validateName(fullNameInput)
    if (!nameValidation.valid) {
      errors.push(nameValidation.message)
    }

    // 3. VALIDATION TYPE 3: Phone Number Validation
    const phoneValidation = validatePhoneNumber(phoneInput)
    if (!phoneValidation.valid) {
      errors.push(phoneValidation.message)
    }

    // 4. VALIDATION TYPE 4: Date Validation
    const dateValidation = validateDates(departureDate, returnDate)
    if (!dateValidation.valid) {
      errors.push(dateValidation.message)
    }

    // 5. VALIDATION TYPE 5: Number Range Validation
    const passengerRangeValidation = validatePassengerRange(totalPassengers, adultPassengers, childPassengers)
    if (!passengerRangeValidation.valid) {
      errors.push(passengerRangeValidation.message)
    }

    // Additional validation: Logical Validation (Sum of passengers)
    const passengerSumValidation = validatePassengerSum(totalPassengers, adultPassengers, childPassengers)
    if (!passengerSumValidation.valid) {
      errors.push(passengerSumValidation.message)
    }

    // Additional validation: Future Date Validation
    const futureDateValidation = validateFutureDate(departureDate)
    if (!futureDateValidation.valid) {
      errors.push(futureDateValidation.message)
    }

    // Display errors if any
    if (errors.length > 0) {
      displayErrors(errors)
      return false
    }

    // If validation passes, show success message
    showSuccessMessage()

    // In a real application, you would submit the form data here
    // For example: sendFormData();
  })

  // 1. Required Field Validation
  function validateRequiredFields(...fields) {
    let valid = true

    fields.forEach((field) => {
      if (!field || !field.value || !field.value.trim()) {
        if (field) field.classList.add("error-input")
        valid = false
      }
    })

    return valid
  }

  // 2. Text Input Validation (Name)
  function validateName(nameInput) {
    if (!nameInput || !nameInput.value) {
      return { valid: true } // Will be caught by required field validation
    }

    const name = nameInput.value.trim()

    // Check if name contains at least two words (first and last name)
    const words = name.split(" ").filter((word) => word.length > 0)

    if (words.length < 2) {
      nameInput.classList.add("error-input")
      return {
        valid: false,
        message: "Harap masukkan nama lengkap (minimal nama depan dan belakang).",
      }
    }

    // Check if name is too short
    if (name.length < 5) {
      nameInput.classList.add("error-input")
      return {
        valid: false,
        message: "Nama terlalu pendek, minimal 5 karakter.",
      }
    }

    // Check if name contains numbers or special characters
    // Without using regex, we'll check each character
    const invalidChars = "0123456789!@#$%^&*()_+=-{}[]|\\:;\"'<>,.?/"
    for (let i = 0; i < name.length; i++) {
      if (invalidChars.includes(name[i])) {
        nameInput.classList.add("error-input")
        return {
          valid: false,
          message: "Nama tidak boleh mengandung angka atau karakter khusus.",
        }
      }
    }

    return { valid: true }
  }

  // 3. Phone Number Validation
  function validatePhoneNumber(phoneInput) {
    if (!phoneInput || !phoneInput.value) {
      return { valid: true } // Will be caught by required field validation
    }

    const phone = phoneInput.value.trim()

    // Check if phone number is too short or too long
    if (phone.length < 10 || phone.length > 15) {
      phoneInput.classList.add("error-input")
      return {
        valid: false,
        message: "Nomor telepon harus antara 10-15 digit.",
      }
    }

    // Check if phone number contains only digits and plus sign
    // Without using regex, we'll check each character
    const validChars = "0123456789+"
    for (let i = 0; i < phone.length; i++) {
      if (!validChars.includes(phone[i])) {
        phoneInput.classList.add("error-input")
        return {
          valid: false,
          message: "Nomor telepon hanya boleh berisi angka dan tanda plus (+).",
        }
      }
    }

    // Check if plus sign is only at the beginning
    if (phone.indexOf("+") > 0) {
      phoneInput.classList.add("error-input")
      return {
        valid: false,
        message: "Tanda plus (+) hanya boleh di awal nomor telepon.",
      }
    }

    return { valid: true }
  }

  // 4. Date Validation
  function validateDates(departureDate, returnDate) {
    // If return date is not filled, it's valid (one-way trip)
    if (!returnDate || !returnDate.value) {
      return { valid: true }
    }

    // If departure date is not filled, we can't compare
    if (!departureDate || !departureDate.value) {
      return { valid: false, message: "Tanggal keberangkatan harus diisi terlebih dahulu." }
    }

    const departure = new Date(departureDate.value)
    const returnD = new Date(returnDate.value)

    // Check if return date is after or equal to departure date
    if (returnD < departure) {
      returnDate.classList.add("error-input")
      return {
        valid: false,
        message: "Tanggal kembali harus setelah atau sama dengan tanggal keberangkatan.",
      }
    }

    return { valid: true }
  }

  // 5. Number Range Validation
  function validatePassengerRange(totalPassengers, adultPassengers, childPassengers) {
    // Check total passengers (1-20 is reasonable)
    if (
      totalPassengers &&
      totalPassengers.value &&
      (Number.parseInt(totalPassengers.value) < 1 || Number.parseInt(totalPassengers.value) > 20)
    ) {
      totalPassengers.classList.add("error-input")
      return {
        valid: false,
        message: "Jumlah penumpang harus antara 1 dan 20.",
      }
    }

    // Check adult passengers (at least 1 adult required)
    if (adultPassengers && adultPassengers.value && Number.parseInt(adultPassengers.value) < 1) {
      adultPassengers.classList.add("error-input")
      return {
        valid: false,
        message: "Minimal harus ada 1 penumpang dewasa.",
      }
    }

    // Check child passengers (0-15 is reasonable)
    if (
      childPassengers &&
      childPassengers.value &&
      (Number.parseInt(childPassengers.value) < 0 || Number.parseInt(childPassengers.value) > 15)
    ) {
      childPassengers.classList.add("error-input")
      return {
        valid: false,
        message: "Jumlah anak-anak harus antara 0 dan 15.",
      }
    }

    return { valid: true }
  }

  // Additional validation: Logical Validation (Sum of passengers)
  function validatePassengerSum(totalPassengers, adultPassengers, childPassengers) {
    // If all fields are filled
    if (
      totalPassengers &&
      totalPassengers.value &&
      adultPassengers &&
      adultPassengers.value &&
      childPassengers &&
      childPassengers.value
    ) {
      const total = Number.parseInt(totalPassengers.value)
      const adults = Number.parseInt(adultPassengers.value)
      const children = Number.parseInt(childPassengers.value)

      // Check if sum of adults and children equals total
      if (adults + children !== total) {
        totalPassengers.classList.add("error-input")
        adultPassengers.classList.add("error-input")
        childPassengers.classList.add("error-input")
        return {
          valid: false,
          message: "Jumlah total penumpang harus sama dengan jumlah dewasa + anak-anak.",
        }
      }
    }

    return { valid: true }
  }

  // Additional validation: Future Date Validation
  function validateFutureDate(dateInput) {
    if (!dateInput || !dateInput.value) {
      return { valid: true } // Will be caught by required field validation
    }

    const selectedDate = new Date(dateInput.value)
    const today = new Date()

    // Reset hours to compare just the dates
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      dateInput.classList.add("error-input")
      return {
        valid: false,
        message: "Tanggal keberangkatan tidak boleh di masa lalu.",
      }
    }

    return { valid: true }
  }

  // Display error messages
  function displayErrors(errors) {
    errorContainer.style.display = "block"
    errorContainer.className = "error" // Ensure error class is applied

    const ul = document.createElement("ul")
    errors.forEach((error) => {
      const li = document.createElement("li")
      li.textContent = error
      ul.appendChild(li)
    })

    errorContainer.appendChild(ul)

    // Scroll to error container
    errorContainer.scrollIntoView({ behavior: "smooth" })
  }

  // Show success message
  function showSuccessMessage() {
    errorContainer.style.display = "block"
    errorContainer.className = "success" // Switch to success class
    errorContainer.innerHTML = "<p>Formulir berhasil dikirim! Terima kasih telah memesan dengan VS Travel.</p>"

    // Reset form after successful submission
    setTimeout(() => {
      // Clear all input fields
      const allInputs = document.querySelectorAll(".form-group input, .form-group select")
      allInputs.forEach((input) => {
        input.value = ""
      })

      // Uncheck checkboxes
      document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = false
      })

      errorContainer.style.display = "none"
    }, 3000)
  }

  // Real-time validation for passenger numbers
  if (totalPassengers && adultPassengers && childPassengers) {
    ;[adultPassengers, childPassengers].forEach((input) => {
      input.addEventListener("input", () => {
        if (adultPassengers.value && childPassengers.value) {
          const adults = Number.parseInt(adultPassengers.value) || 0
          const children = Number.parseInt(childPassengers.value) || 0

          // Auto-update total passengers
          totalPassengers.value = adults + children
        }
      })
    })

    totalPassengers.addEventListener("input", () => {
      // When total changes, if adults exist, adjust children
      if (adultPassengers.value) {
        const total = Number.parseInt(totalPassengers.value) || 0
        const adults = Number.parseInt(adultPassengers.value) || 0

        // Ensure adults don't exceed total
        if (adults > total) {
          adultPassengers.value = total
          childPassengers.value = 0
        } else {
          childPassengers.value = total - adults
        }
      }
    })
  }
})
