<template>
  <div class="py-12">
    <UContainer>
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Get In Touch
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Ready to capture your special moments? I'd love to hear about your vision and discuss how we can bring it to life.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <!-- Contact Information -->
        <div>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Let's Connect
          </h2>
          
          <div class="space-y-6">
            <!-- Email -->
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-envelope" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Email
                </h3>
                <p class="text-gray-600 dark:text-gray-300">
                  hello@fiftymillimeter.com
                </p>
              </div>
            </div>

            <!-- Phone -->
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-phone" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Phone
                </h3>
                <p class="text-gray-600 dark:text-gray-300">
                  +1 (555) 123-4567
                </p>
              </div>
            </div>

            <!-- Location -->
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Location
                </h3>
                <p class="text-gray-600 dark:text-gray-300">
                  [Your City, State]
                </p>
              </div>
            </div>

            <!-- Social Media -->
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-camera" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Follow My Work
                </h3>
                <div class="flex space-x-3">
                  <UButton
                    variant="outline"
                    color="gray"
                    size="sm"
                    to="https://instagram.com/fiftymillimeter"
                    external
                    target="_blank"
                  >
                    <UIcon name="i-simple-icons-instagram" class="w-4 h-4" />
                    Instagram
                  </UButton>
                </div>
              </div>
            </div>
          </div>

          <!-- Services -->
          <div class="mt-12">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Photography Services
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 class="font-medium text-gray-900 dark:text-white mb-2">Portrait Photography</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">Individual, family, and professional portraits</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 class="font-medium text-gray-900 dark:text-white mb-2">Event Photography</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">Weddings, celebrations, and special occasions</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 class="font-medium text-gray-900 dark:text-white mb-2">Commercial Photography</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">Business, product, and brand photography</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 class="font-medium text-gray-900 dark:text-white mb-2">Landscape Photography</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">Nature, architecture, and travel photography</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Send a Message
            </h2>
            
            <form @submit.prevent="submitForm" class="space-y-6">
              <!-- Name -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <UInput
                  id="name"
                  v-model="form.name"
                  placeholder="Your full name"
                  required
                />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <UInput
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <!-- Phone -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <UInput
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <!-- Service Type -->
              <div>
                <label for="service" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Photography Service
                </label>
                <USelect
                  id="service"
                  v-model="form.service"
                  :options="serviceOptions"
                  placeholder="Select a service"
                />
              </div>

              <!-- Event Date -->
              <div>
                <label for="eventDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Date
                </label>
                <UInput
                  id="eventDate"
                  v-model="form.eventDate"
                  type="date"
                />
              </div>

              <!-- Message -->
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tell me about your vision *
                </label>
                <UTextarea
                  id="message"
                  v-model="form.message"
                  :rows="5"
                  placeholder="Describe your photography needs, vision, or any questions you have..."
                  required
                />
              </div>

              <!-- Submit Button -->
              <UButton
                type="submit"
                :loading="isSubmitting"
                :disabled="!form.name || !form.email || !form.message"
                size="lg"
                class="w-full"
              >
                Send Message
              </UButton>
            </form>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'Contact - Fifty Millimeter',
  ogTitle: 'Contact - Fifty Millimeter',
  description: 'Get in touch to discuss your photography needs. Available for portraits, events, commercial, and landscape photography.',
  ogDescription: 'Get in touch to discuss your photography needs. Available for portraits, events, commercial, and landscape photography.',
})

// Form state
const form = reactive({
  name: '',
  email: '',
  phone: '',
  service: '',
  eventDate: '',
  message: ''
})

const isSubmitting = ref(false)

// Service options
const serviceOptions = [
  { label: 'Portrait Photography', value: 'portrait' },
  { label: 'Event Photography', value: 'event' },
  { label: 'Wedding Photography', value: 'wedding' },
  { label: 'Commercial Photography', value: 'commercial' },
  { label: 'Landscape Photography', value: 'landscape' },
  { label: 'Other', value: 'other' }
]

// Form submission
const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success message
    const toast = useToast()
    toast.add({
      title: 'Message Sent!',
      description: 'Thank you for your message. I\'ll get back to you within 24 hours.',
      color: 'green'
    })
    
    // Reset form
    Object.keys(form).forEach(key => {
      form[key] = ''
    })
    
  } catch (error) {
    // Show error message
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to send message. Please try again or contact me directly.',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>