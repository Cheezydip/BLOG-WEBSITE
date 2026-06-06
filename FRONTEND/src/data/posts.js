import sandakphuPic from '../assets/sandakphu/sbg.jpg'
import goechalaPic from '../assets/Sikkim/s5.jpeg'
import markhaPic from '../assets/Ladakh/l1.jpg'
import flowersPic from '../assets/Uttarakhand/ubg.jpg'
import kashmirPic from '../assets/Kashmir/kbg1.jpeg'
import hamptaPic from '../assets/himachal/hbg.jpg'
import tongluPic from '../assets/darjeeling/d1.jpg'
import ziroPic from '../assets/ziro/zirobg1.png'
import kedarnathPic from '../assets/SnowyMountain/KEDARNATH.jpg'
import spitiPic from '../assets/SnowyMountain/spiti valley.jpg'
import gurudongmarPic from '../assets/Beachesorlakesorfalls/gurudongmar.jpg'
import sonamargPic from '../assets/SnowyMountain/sonmarg.jpg'

const posts = [
  {
    id: 'featured',
    display_order: 1,
    type: 'featured',
    badge: 'Must Read',
    title: 'Sandakphu Trek: Walking the Sleeping Buddha Ridge',
    slug: 'sandakphu-trek',
    excerpt:
      "A comprehensive guide to West Bengal's highest peak, offering panoramic views of four of the world's five highest mountains.",
    author: 'Rupayan Saha',
    category: 'Trail Guides',
    category_color: '#1f3c2f',
    tags: ['sandakphu', 'treks', 'kanchenjunga'],
    status: 'published',
    publishedAt: 'June 5, 2026',
    readingTime: '8 min read',
    image: sandakphuPic,
    content:
      'The Sandakphu trek is famous for the "Sleeping Buddha" - a spectacular cluster of peaks including Kanchenjunga that resembles a reclining Buddha.\nStarting from Manebhanjan, the trail passes through lush pine forests and rhododendron fields, entering the Singalila National Park.\nThe climb is steep but rewarding, culminating in a 3636m summit where Everest, Lhotse, Makalu, and Kanchenjunga stand in clear sight.'
  },
  {
    id: 'p1',
    display_order: 2,
    badge: 'Sikkim',
    title: 'Goechala Trek: In the Shadow of Mount Kanchenjunga',
    slug: 'goechala-trek',
    excerpt:
      "Explore the alpine meadows of Sikkim and witness the sun rise over the towering Kanchenjunga range from the high pass of Goechala.",
    author: 'August Renner',
    category: 'Trail Guides',
    category_color: '#1f3c2f',
    tags: ['goechala', 'sikkim', 'kanchenjunga'],
    status: 'published',
    publishedAt: 'May 28, 2026',
    readingTime: '6 min read',
    image: goechalaPic,
    content:
      'Starting from the quiet village of Yuksom, the Goechala trail winds through the Kanchenjunga National Park.\nAs you ascend through Sachen and Tsokha, the dense oak forests give way to massive alpine pastures at Thansing.\nThe highlight is the sunrise at View Point 1, where the massive wall of Kanchenjunga turns golden in the first light.'
  },
  {
    id: 'p2',
    display_order: 3,
    badge: 'Ladakh',
    title: 'Markha Valley Trek: Walking the High Deserts of Ladakh',
    slug: 'markha-valley-trek',
    excerpt:
      "Cross high passes, visit ancient Buddhist monasteries, and traverse the stunning barren landscapes of the Markha Valley in Ladakh.",
    author: 'Mira Collins',
    category: 'Expeditions',
    category_color: '#d35400',
    tags: ['markha-valley', 'ladakh', 'high-altitude'],
    status: 'published',
    publishedAt: 'May 12, 2026',
    readingTime: '7 min read',
    image: markhaPic,
    content:
      'The Markha Valley trek is one of Ladakh\'s most popular routes, offering a glimpse into remote Himalayan culture.\nYou will hike alongside the Markha River, passing green barley fields, ancient stupas, and remote villages like Hankar.\nCrossing the Kongmaru La pass at 5200m is challenging but offers panoramic views of the Karakoram range and Kang Yatse peak.'
  },
  {
    id: 'p3',
    display_order: 4,
    badge: 'Uttarakhand',
    title: 'Valley of Flowers: A Walk in Uttarakhand\'s Alpine Eden',
    slug: 'valley-of-flowers-trek',
    excerpt:
      "Discover the UNESCO World Heritage site carpeted in thousands of species of wild alpine flowers during the monsoon season.",
    author: 'Jules Park',
    category: 'Trail Guides',
    category_color: '#1f3c2f',
    tags: ['valley-of-flowers', 'uttarakhand', 'monsoon-treks'],
    status: 'published',
    publishedAt: 'May 4, 2026',
    readingTime: '9 min read',
    image: flowersPic,
    content:
      'Hidden high in the Garhwal Himalayas, the Valley of Flowers is a natural reserve of rare flora and fauna.\nThe trek begins from Govindghat and follows the Lakshman Ganga river up to the base camp at Ghangaria.\nIn July and August, the entire valley blooms with blue poppies, orchids, and anemones, creating a stunning field of colors.'
  },
  {
    id: 'p4',
    display_order: 5,
    badge: 'Kashmir',
    title: 'Kashmir Great Lakes Trek: A Journey Through Alpine Paradises',
    slug: 'kashmir-great-lakes-trek',
    excerpt:
      "A majestic trek in Kashmir passing through seven alpine lakes, snow-clad mountain passes, and vast meadows.",
    author: 'Rupayan Saha',
    category: 'Trail Guides',
    category_color: '#1f3c2f',
    tags: ['kashmir', 'great-lakes', 'alpine-lakes'],
    status: 'published',
    publishedAt: 'May 1, 2026',
    readingTime: '8 min read',
    image: kashmirPic,
    content:
      'The Kashmir Great Lakes trek is a visually stunning trek that takes you through the heart of the Kashmir Himalayas.\nEvery day is a new meadow and a new alpine lake, from Vishansar and Kishansar to Gadsar, Satsar, and Gangabal.\nThe trail crosses high-altitude passes like Gadsar Pass at 4200m, presenting panoramic views of the surrounding peaks.'
  },
  {
    id: 'p5',
    display_order: 6,
    badge: 'Himachal',
    title: 'Hampta Pass Trek: The Dramatic Crossroads of Himachal',
    slug: 'hampta-pass-trek',
    excerpt:
      "Experience the contrast between the lush green valleys of Kullu and the stark, barren deserts of Lahaul via the Hampta Pass.",
    author: 'August Renner',
    category: 'Trail Guides',
    category_color: '#1f3c2f',
    tags: ['hampta-pass', 'himachal', 'chandratal'],
    status: 'published',
    publishedAt: 'April 25, 2026',
    readingTime: '6 min read',
    image: hamptaPic,
    content:
      'The Hampta Pass trek is famous for its dramatic shift in landscapes.\nYou begin in the green valleys of Kullu, trekking past pine forests and wildflower meadows to Shea Goru.\nOnce you cross the Hampta Pass at 4270m, you enter the barren, cold desert landscape of Lahaul, followed by a visit to the crescent-shaped Chandratal Lake.'
  },
  {
    id: 'p6',
    display_order: 7,
    badge: 'Darjeeling',
    title: 'Tonglu & Tumling Trek: The Singalila Ridge Gateway',
    slug: 'tonglu-trek',
    excerpt:
      "A gentle trek offering panoramic views of Mount Kanchenjunga and cozy tea house stays along the Indo-Nepal border.",
    author: 'Jules Park',
    category: 'Preparation',
    category_color: '#2c3e50',
    tags: ['darjeeling', 'tonglu', 'singalila'],
    status: 'published',
    publishedAt: 'April 15, 2026',
    readingTime: '5 min read',
    image: tongluPic,
    content:
      'The trek to Tonglu and Tumling is a beginner-friendly section of the Singalila Ridge trail.\nStarting from Dhotrey or Chitrey, the trail winds through rhododendron and bamboo forests along the border ridge.\nStaying in local tea houses in Tumling and watching the sunrise over the Kanchenjunga range is a memorable experience.'
  },
  {
    id: 'p7',
    display_order: 8,
    badge: 'Arunachal',
    title: 'Ziro Valley: Trekking the Pine Hills of Arunachal',
    slug: 'ziro-valley-trek',
    excerpt:
      "Explore the unique culture of the Apatani tribe and trek through the misty pine forests of Arunachal Pradesh.",
    author: 'Mira Collins',
    category: 'Expeditions',
    category_color: '#d35400',
    tags: ['ziro-valley', 'arunachal', 'tribal-culture'],
    status: 'published',
    publishedAt: 'April 5, 2026',
    readingTime: '7 min read',
    image: ziroPic,
    content:
      'Ziro Valley is a beautiful plateau surrounded by pine-covered hills and terraced rice fields.\nTrekking here takes you through the Talley Valley Wildlife Sanctuary, home to diverse flora and fauna, including the endangered clouded leopard.\nYou will also get a chance to interact with the Apatani tribe and learn about their sustainable farming practices.'
  },
  {
    id: 'p8',
    display_order: 9,
    badge: 'Uttarakhand',
    title: 'Kedarnath Trek: Walking the Pilgrim\'s Path',
    slug: 'kedarnath-trek',
    excerpt:
      "A spiritual and physical journey through the heart of the Garhwal Himalayas to the sacred temple of Kedarnath.",
    author: 'Rupayan Saha',
    category: 'Trail Guides',
    category_color: '#1f3c2f',
    tags: ['kedarnath', 'uttarakhand', 'pilgrimage', 'himalayas'],
    status: 'published',
    publishedAt: 'June 1, 2026',
    readingTime: '7 min read',
    image: kedarnathPic,
    content:
      'The Kedarnath trek is a legendary route in Uttarakhand, winding along the Mandakini River.\nStarting from Gaurikund, the trail ascends steeply through lush forests, waterfalls, and scenic viewpoints before reaching the historic temple at 3583m.\nIt is a unique blend of spiritual devotion and raw mountain beauty, with the majestic Kedarnath peak standing tall in the background.'
  },
  {
    id: 'p9',
    display_order: 10,
    badge: 'Himachal',
    title: 'Spiti Valley Trek: Traversing the High Altitude Cold Deserts',
    slug: 'spiti-valley-trek',
    excerpt:
      "Explore the rugged terrains, ancient cliffside monasteries, and pristine high-altitude villages of Spiti Valley.",
    author: 'Mira Collins',
    category: 'Expeditions',
    category_color: '#d35400',
    tags: ['spiti', 'himachal', 'cold-desert', 'monastery'],
    status: 'published',
    publishedAt: 'May 20, 2026',
    readingTime: '8 min read',
    image: spitiPic,
    content:
      'Spiti Valley is a high-altitude desert that offers a mystical landscape of stark mountains and deep gorges.\nTrekking through Spiti takes you past key attractions like the Key Monastery, Kibber village (one of the highest inhabited villages), and the stunning Pin Valley.\nIt is an adventurous expedition for those seeking solitude and ancient Tibetan Buddhist culture.'
  },
  {
    id: 'p10',
    display_order: 11,
    badge: 'Sikkim',
    title: 'Gurudongmar Lake: A Journey to Sikkim\'s Sacred Waters',
    slug: 'gurudongmar-lake-trek',
    excerpt:
      "Visit one of the highest lakes in the world, sacred to Buddhists and Sikhs, situated close to the Indo-China border.",
    author: 'August Renner',
    category: 'Expeditions',
    category_color: '#d35400',
    tags: ['gurudongmar', 'sikkim', 'high-altitude', 'lakes'],
    status: 'published',
    publishedAt: 'May 15, 2026',
    readingTime: '6 min read',
    image: gurudongmarPic,
    content:
      'Gurudongmar Lake is a stunning alpine lake located at an altitude of 5430m in North Sikkim.\nThe trek is challenging due to the thin air and freezing temperatures, but the sight of the turquoise blue water surrounded by snow-capped peaks is breathtaking.\nRegarded as holy, a part of the lake remains unfrozen even in the dead of winter.'
  },
  {
    id: 'p11',
    display_order: 12,
    badge: 'Kashmir',
    title: 'Sonamarg Winter Trek: Wandering the Meadows of Gold',
    slug: 'sonamarg-trek',
    excerpt:
      "A scenic trail through snow-covered pine forests and glaciers in Kashmir's Golden Meadow.",
    author: 'Jules Park',
    category: 'Trail Guides',
    category_color: '#1f3c2f',
    tags: ['sonamarg', 'kashmir', 'glaciers', 'winter-trek'],
    status: 'published',
    publishedAt: 'April 30, 2026',
    readingTime: '6 min read',
    image: sonamargPic,
    content:
      'Sonamarg, meaning \'Meadow of Gold\', serves as the gateway to the high-altitude passes of Ladakh.\nThe trek to Thajiwas Glacier is a short yet spectacular walk through snow-laden pine fields, frozen streams, and majestic alpine vistas.\nIt is the perfect introduction to winter trekking in Kashmir, offering pristine views of the Sindh River and towering snow walls.'
  }
]

export default posts
