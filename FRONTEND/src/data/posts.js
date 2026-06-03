import blogPic1 from '../assets/blog_pic_1.png'
import blogPic2 from '../assets/blog_pic_2.png'
import blogPic3 from '../assets/blog_pic_3.png'
import blogPic4 from '../assets/blog_pic_4.png'

const posts = [
  {
    id: 'featured',
    display_order: 1,
    type: 'featured',
    badge: 'Must Read',
    title: 'Full-Frame vs. Crop Sensor: Which for Photography?',
    slug: 'full-frame-vs-crop-sensor',
    excerpt:
      "An honest look at the real-world differences between these camera systems so you can pick the kit that fits your photography style.",
    author: 'August Renner',
    category: 'Gear',
    category_color: '#7d1a4a',
    tags: ['gear', 'cameras', 'choices'],
    status: 'published',
    publishedAt: 'May 26, 2026',
    readingTime: '8 min read',
    image: blogPic1,
    content:
      'Full-frame sensors offer more light and smoother depth, but they also demand more in size and budget.\nCrop sensors keep gear lighter and lenses longer, which matters when you travel or shoot wildlife.\nStart by listing what you actually shoot, then pick the system that makes that work easier.'
  },
  {
    id: 'p1',
    display_order: 2,
    badge: 'Lighting',
    title: 'Finding Natural Light in Unexpected Places',
    slug: 'finding-natural-light',
    excerpt:
      'Train your eye to spot clean, cinematic light in streets, stairwells, and other places most shooters walk past.',
    author: 'Mira Collins',
    category: 'Lighting',
    category_color: '#2c4c34',
    tags: ['light', 'street', 'practice'],
    status: 'published',
    publishedAt: 'May 18, 2026',
    readingTime: '6 min read',
    image: blogPic2,
    content:
      'Start by walking with no camera and just watch how light falls across surfaces.\nLook for bounce light near neutral walls and watch how it wraps a subject.\nWhen you return with the camera, you will already know where the soft light lives.'
  },
  {
    id: 'p2',
    display_order: 3,
    badge: 'Editing',
    title: 'My Approach to Editing: Creating a Consistent Photography Style',
    slug: 'consistent-editing-style',
    excerpt:
      'Build a repeatable edit workflow that keeps color, contrast, and skin tones consistent across every shoot.',
    author: 'Jules Park',
    category: 'Editing',
    category_color: '#a63e2d',
    tags: ['editing', 'workflow', 'color'],
    status: 'published',
    publishedAt: 'May 12, 2026',
    readingTime: '7 min read',
    image: blogPic3,
    content:
      'Keep a reference folder of your best images and compare new edits against it.\nBuild presets for exposure, tone curve, and color balance before you touch local adjustments.\nYour style becomes consistent when the first ten minutes of every edit session are the same.'
  },
  {
    id: 'p3',
    display_order: 4,
    badge: 'Business',
    title: 'Pricing Your Photography: Strategies That Work',
    slug: 'pricing-strategies',
    excerpt:
      'Set pricing that respects your time, covers your costs, and communicates real value to clients.',
    author: 'Ravi Desai',
    category: 'Business',
    category_color: '#1a2b8c',
    tags: ['business', 'pricing', 'clients'],
    status: 'published',
    publishedAt: 'May 4, 2026',
    readingTime: '9 min read',
    image: blogPic4,
    content:
      'Build your pricing from your real cost of doing business, not from other photographers.\nOffer clear tiers with defined deliverables so clients understand what they are buying.\nA confident price paired with a clean proposal closes faster than discounting.'
  }
]

export default posts
