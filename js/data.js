/**
 * 经典艺术名画名作“奶蛙 / 奶龙”系列高清艺术展项数据集
 * 完整映射 assets/ 目录下的全部 60 幅名画拟态摄影与绘图素材
 * （原 16 幅 + 本次新增 44 幅）
 */
const GALLERY_ITEMS = [
  {
    id: 1,
    title: "创世之奶蛙",
    subtitle: "西斯廷指尖圣光",
    category: "Renaissance / Michelangelo",
    accentColor: "#F3A152",
    gradient: "linear-gradient(135deg, #2c1a0e 0%, #7d5431 50%, #f3a152 100%)",
    image: encodeURI("assets/创世之奶蛙.webp")
  },
  {
    id: 2,
    title: "蒙娜蛙",
    subtitle: "神秘微笑永恒凝视",
    category: "Masterpiece / Leonardo da Vinci",
    accentColor: "#3CBA92",
    gradient: "linear-gradient(135deg, #131c15 0%, #2f4534 50%, #3cba92 100%)",
    image: encodeURI("assets/蒙娜蛙.jpg")
  },
  {
    id: 3,
    title: "翻越阿尔卑斯",
    subtitle: "跨越雪山雄姿英发",
    category: "Neoclassicism / Jacques-Louis David",
    accentColor: "#FF4E50",
    gradient: "linear-gradient(135deg, #2b0b0e 0%, #781d22 50%, #ff4e50 100%)",
    image: encodeURI("assets/翻越阿尔卑斯.jpeg")
  },
  {
    id: 4,
    title: "最后的晚蛙",
    subtitle: "共聚时刻凝固瞬间",
    category: "High Renaissance / Leonardo da Vinci",
    accentColor: "#E0A96D",
    gradient: "linear-gradient(135deg, #241910 0%, #5e432d 50%, #e0a96d 100%)",
    image: encodeURI("assets/最后的晚蛙.jpeg")
  },
  {
    id: 5,
    title: "思想中的奶蛙",
    subtitle: "沉思深邃的哲理雕塑",
    category: "Sculpture / Auguste Rodin",
    accentColor: "#A8B2C1",
    gradient: "linear-gradient(135deg, #1a1e24 0%, #475569 50%, #a8b2c1 100%)",
    image: encodeURI("assets/思想中的奶蛙.jpg")
  },
  {
    id: 6,
    title: "记忆中的奶蛙",
    subtitle: "软化时钟梦境超现实",
    category: "Surrealism / Salvador Dalí",
    accentColor: "#00F0FF",
    gradient: "linear-gradient(135deg, #0d2836 0%, #1e5a75 50%, #00f0ff 100%)",
    image: encodeURI("assets/记忆中的奶蛙.jpg")
  },
  {
    id: 7,
    title: "秋千上的奶蛙",
    subtitle: "洛可可花园微风轻拂",
    category: "Rococo / Jean-Honoré Fragonard",
    accentColor: "#FBC2EB",
    gradient: "linear-gradient(135deg, #291224 0%, #753367 50%, #fbc2eb 100%)",
    image: encodeURI("assets/秋千上的奶蛙.webp")
  },
  {
    id: 8,
    title: "清明上河蛙",
    subtitle: "汴河盛景烟火人间",
    category: "Traditional Chinese / Zhang Zeduan",
    accentColor: "#C2A649",
    gradient: "linear-gradient(135deg, #261f0d 0%, #635324 50%, #c2a649 100%)",
    image: encodeURI("assets/清明上河蛙.jpeg")
  },
  {
    id: 9,
    title: "美杜莎之筏的蛙",
    subtitle: "破浪求生的壮阔波澜",
    category: "Romanticism / Théodore Géricault",
    accentColor: "#3A7BD5",
    gradient: "linear-gradient(135deg, #0d1e33 0%, #204675 50%, #3a7bd5 100%)",
    image: encodeURI("assets/美杜莎之筏的蛙.jpeg")
  },
  {
    id: 10,
    title: "堕天使之蛙",
    subtitle: "目光如炬桀骜之泪",
    category: "Academic / Alexandre Cabanel",
    accentColor: "#7928CA",
    gradient: "linear-gradient(135deg, #1c0a2e 0%, #461b73 50%, #7928ca 100%)",
    image: encodeURI("assets/堕天使之蛙.jpeg")
  },
  {
    id: 11,
    title: "圣咏的奶蛙",
    subtitle: "唱诗乐章庄严回响",
    category: "Sacred / Choir",
    accentColor: "#D4AF37",
    gradient: "linear-gradient(135deg, #29210a 0%, #6e5a1b 50%, #d4af37 100%)",
    image: encodeURI("assets/圣咏的奶蛙.jpg")
  },
  {
    id: 12,
    title: "探戈中的奶蛙",
    subtitle: "红黑交织浪漫步调",
    category: "Passionate / Dance",
    accentColor: "#FF0055",
    gradient: "linear-gradient(135deg, #330011 0%, #80002b 50%, #ff0055 100%)",
    image: encodeURI("assets/探戈中的奶蛙.jpeg")
  },
  {
    id: 13,
    title: "天堂咏叹的奶蛙",
    subtitle: "光芒普照空灵天籁",
    category: "Celestial / Harmony",
    accentColor: "#67B26F",
    gradient: "linear-gradient(135deg, #112914 0%, #2e6634 50%, #67b26f 100%)",
    image: encodeURI("assets/天堂咏叹的奶蛙.jpg")
  },
  {
    id: 14,
    title: "宇航的奶蛙",
    subtitle: "漫游浩瀚星辰之梦",
    category: "Modern / Space Odyssey",
    accentColor: "#00C9FF",
    gradient: "linear-gradient(135deg, #091e2e 0%, #15456b 50%, #00c9ff 100%)",
    image: encodeURI("assets/宇航的奶蛙.jpeg")
  },
  {
    id: 15,
    title: "立体之奶蛙",
    subtitle: "解构重组几何美学",
    category: "Cubism / Modern Art",
    accentColor: "#E65C00",
    gradient: "linear-gradient(135deg, #2b1100 0%, #7a3100 50%, #e65c00 100%)",
    image: encodeURI("assets/立体之奶蛙.jpg")
  },
  {
    id: 16,
    title: "受难之奶蛙",
    subtitle: "悲悯史诗历史回眸",
    category: "Baroque / Classic",
    accentColor: "#8E2DE2",
    gradient: "linear-gradient(135deg, #1f0a33 0%, #4f1b80 50%, #8e2de2 100%)",
    image: encodeURI("assets/受难之奶蛙.jpg")
  },

  /* ===== 本次新增 44 幅展品 (ids 17 - 60) ===== */
  {
    id: 17,
    title: "丘比特与普赛克",
    subtitle: "古典神话缠绵之爱",
    category: "Neoclassicism / Antonio Canova",
    accentColor: "#FBC2EB",
    gradient: "linear-gradient(135deg, #291224 0%, #753367 50%, #fbc2eb 100%)",
    image: encodeURI("assets/丘比特和普赛克.jpeg")
  },
  {
    id: 18,
    title: "以利亚的献祭",
    subtitle: "圣火降于祭坛之巅",
    category: "Biblical / Prophet Elijah",
    accentColor: "#F3A152",
    gradient: "linear-gradient(135deg, #2c1a0e 0%, #7d5431 50%, #f3a152 100%)",
    image: encodeURI("assets/以利亚的献祭.webp")
  },
  {
    id: 19,
    title: "俄耳甫斯与欧律狄刻",
    subtitle: "冥河之畔生死诀别",
    category: "Mythology / Underworld",
    accentColor: "#3A7BD5",
    gradient: "linear-gradient(135deg, #0d1e33 0%, #204675 50%, #3a7bd5 100%)",
    image: encodeURI("assets/俄耳甫斯和欧律狄刻.jpeg")
  },
  {
    id: 20,
    title: "十字军东征",
    subtitle: "中世纪圣战铁骑",
    category: "Medieval / Crusade",
    accentColor: "#C0392B",
    gradient: "linear-gradient(135deg, #2b0b0e 0%, #6e1d22 50%, #c0392b 100%)",
    image: encodeURI("assets/十字军东征.jpeg")
  },
  {
    id: 21,
    title: "千龙远征",
    subtitle: "史诗征途万龙齐发",
    category: "Epic / Fantasy",
    accentColor: "#00C9FF",
    gradient: "linear-gradient(135deg, #091e2e 0%, #15456b 50%, #00c9ff 100%)",
    image: encodeURI("assets/千龙远征.jpeg")
  },
  {
    id: 22,
    title: "召唤奶龙",
    subtitle: "神秘仪式唤醒巨龙",
    category: "Fantasy / Ritual",
    accentColor: "#7928CA",
    gradient: "linear-gradient(135deg, #1c0a2e 0%, #461b73 50%, #7928ca 100%)",
    image: encodeURI("assets/召唤奶龙.jpeg")
  },
  {
    id: 23,
    title: "向日葵",
    subtitle: "梵高炽烈生命礼赞",
    category: "Post-Impressionism / Van Gogh",
    accentColor: "#E8B53A",
    gradient: "linear-gradient(135deg, #2c2410 0%, #7d6a2b 50%, #e8b53a 100%)",
    image: encodeURI("assets/向日葵.jpeg")
  },
  {
    id: 24,
    title: "呐喊",
    subtitle: "表现主义灵魂颤栗",
    category: "Expressionism / Edvard Munch",
    accentColor: "#00F0FF",
    gradient: "linear-gradient(135deg, #0d2836 0%, #1e5a75 50%, #00f0ff 100%)",
    image: encodeURI("assets/呐喊.jpeg")
  },
  {
    id: 25,
    title: "圣米迦勒大天使长",
    subtitle: "天使长持剑降群魔",
    category: "Sacred / Archangel",
    accentColor: "#D4AF37",
    gradient: "linear-gradient(135deg, #1a1407 0%, #5e4a1b 50%, #d4af37 100%)",
    image: encodeURI("assets/圣米迦勒大天使长.jpeg")
  },
  {
    id: 26,
    title: "塔楼楼梯上的相遇",
    subtitle: "罗曼蒂克隐秘邂逅",
    category: "Romanticism / Encounter",
    accentColor: "#E75480",
    gradient: "linear-gradient(135deg, #2c0f1a 0%, #7a2440 50%, #e75480 100%)",
    image: encodeURI("assets/塔楼楼梯上的相遇.jpeg")
  },
  {
    id: 27,
    title: "塞利姆与祖蕾卡",
    subtitle: "东方情诗隔世相思",
    category: "Orientalist / Poetry",
    accentColor: "#C2A649",
    gradient: "linear-gradient(135deg, #221c0a 0%, #5e4f20 50%, #c2a649 100%)",
    image: encodeURI("assets/塞利姆与祖蕾卡.jpeg")
  },
  {
    id: 28,
    title: "复活",
    subtitle: "神圣之光破晓重生",
    category: "Sacred / Resurrection",
    accentColor: "#67B26F",
    gradient: "linear-gradient(135deg, #112914 0%, #2e6634 50%, #67b26f 100%)",
    image: encodeURI("assets/复活.jpeg")
  },
  {
    id: 29,
    title: "夜巡",
    subtitle: "伦勃朗群像鎏金",
    category: "Baroque / Rembrandt",
    accentColor: "#E0A96D",
    gradient: "linear-gradient(135deg, #1e1409 0%, #5e432d 50%, #e0a96d 100%)",
    image: encodeURI("assets/夜巡.jpeg")
  },
  {
    id: 30,
    title: "天启四骑士",
    subtitle: "末世降临审判将至",
    category: "Apocalypse / Revelation",
    accentColor: "#B91C1C",
    gradient: "linear-gradient(135deg, #1a0606 0%, #5e1414 50%, #b91c1c 100%)",
    image: encodeURI("assets/天启四骑士.webp")
  },
  {
    id: 31,
    title: "奶娃与天使",
    subtitle: "天真圣洁羽翼环拥",
    category: "Sacred / Innocence",
    accentColor: "#E8C99B",
    gradient: "linear-gradient(135deg, #1c160c 0%, #5e4f2d 50%, #e8c99b 100%)",
    image: encodeURI("assets/奶娃与天使.jpeg")
  },
  {
    id: 32,
    title: "奶娃的救赎",
    subtitle: "救赎之光抚平创伤",
    category: "Sacred / Redemption",
    accentColor: "#C9A24B",
    gradient: "linear-gradient(135deg, #1a1407 0%, #5e4a1b 50%, #c9a24b 100%)",
    image: encodeURI("assets/奶娃的救赎.jpeg")
  },
  {
    id: 33,
    title: "奶拉之死",
    subtitle: "神秘第四席圣宴",
    category: "Sacred / Banquet",
    accentColor: "#8E2DE2",
    gradient: "linear-gradient(135deg, #1f0a33 0%, #4f1b80 50%, #8e2de2 100%)",
    image: encodeURI("assets/奶拉之死.jpeg")
  },
  {
    id: 34,
    title: "奶撒之死",
    subtitle: "圣者末路悲怆长歌",
    category: "Sacred / Passion",
    accentColor: "#C0392B",
    gradient: "linear-gradient(135deg, #260a0c 0%, #6e1418 50%, #c0392b 100%)",
    image: encodeURI("assets/奶撒之死.webp")
  },
  {
    id: 35,
    title: "奶母怜子",
    subtitle: "圣母垂泪怀抱圣婴",
    category: "Sacred / Pietà",
    accentColor: "#A8B2C1",
    gradient: "linear-gradient(135deg, #161a20 0%, #3a4250 50%, #a8b2c1 100%)",
    image: encodeURI("assets/奶母怜子.webp")
  },
  {
    id: 36,
    title: "奶破龙一世加冕大典",
    subtitle: "帝冕加身荣光万丈",
    category: "Neoclassicism / Coronation",
    accentColor: "#D4AF37",
    gradient: "linear-gradient(135deg, #1e1605 0%, #6e581a 50%, #d4af37 100%)",
    image: encodeURI("assets/奶破龙一世加冕大典.jpeg")
  },
  {
    id: 37,
    title: "奶破龙在战场",
    subtitle: "硝烟之中指挥若定",
    category: "History / Battlefield",
    accentColor: "#FF4E50",
    gradient: "linear-gradient(135deg, #2b0b0e 0%, #781d22 50%, #ff4e50 100%)",
    image: encodeURI("assets/奶破龙在战场.jpeg")
  },
  {
    id: 38,
    title: "奶破龙在阿尔柯桥上",
    subtitle: "桥头领军孤勇冲锋",
    category: "History / Battle of Arcole",
    accentColor: "#2E86DE",
    gradient: "linear-gradient(135deg, #0d1e33 0%, #204675 50%, #2e86de 100%)",
    image: encodeURI("assets/奶破龙在阿尔柯桥上.jpeg")
  },
  {
    id: 39,
    title: "奶破龙的加冕典礼",
    subtitle: "教权与帝权交汇",
    category: "Neoclassicism / Jacques-Louis David",
    accentColor: "#C9A24B",
    gradient: "linear-gradient(135deg, #1e1605 0%, #6e581a 50%, #c9a24b 100%)",
    image: encodeURI("assets/奶破龙的加冕典礼.jpeg")
  },
  {
    id: 40,
    title: "奶破龙翻越阿尔卑斯山",
    subtitle: "冰雪雄关一越而过",
    category: "Neoclassicism / Jacques-Louis David",
    accentColor: "#4FC3F7",
    gradient: "linear-gradient(135deg, #091e2e 0%, #15456b 50%, #4fc3f7 100%)",
    image: encodeURI("assets/奶破龙翻越阿尔卑斯山.jpeg")
  },
  {
    id: 41,
    title: "奶龙之筏",
    subtitle: "汪洋孤筏望见生机",
    category: "Romanticism / Théodore Géricault",
    accentColor: "#1E6091",
    gradient: "linear-gradient(135deg, #0d1e33 0%, #204675 50%, #1e6091 100%)",
    image: encodeURI("assets/奶龙之筏.jpeg")
  },
  {
    id: 42,
    title: "奶龙什天",
    subtitle: "腾云驾雾羽化升天",
    category: "Celestial / Ascension",
    accentColor: "#E6E1D2",
    gradient: "linear-gradient(135deg, #181a16 0%, #4a4a3a 50%, #e6e1d2 100%)",
    image: encodeURI("assets/奶龙什天.jpeg")
  },
  {
    id: 43,
    title: "奶龙分海",
    subtitle: "神迹劈开滔天巨浪",
    category: "Biblical / Miracle",
    accentColor: "#40C4FF",
    gradient: "linear-gradient(135deg, #091e2e 0%, #15456b 50%, #40c4ff 100%)",
    image: encodeURI("assets/奶龙分海.webp")
  },
  {
    id: 44,
    title: "奶龙学院",
    subtitle: "雅典哲思群贤毕至",
    category: "Renaissance / Raphael",
    accentColor: "#B8860B",
    gradient: "linear-gradient(135deg, #221c0a 0%, #5e4f20 50%, #b8860b 100%)",
    image: encodeURI("assets/奶龙学院.jpeg")
  },
  {
    id: 45,
    title: "奶龙帝国成立",
    subtitle: "基业初定万代宏图",
    category: "History / Empire",
    accentColor: "#9B1B1B",
    gradient: "linear-gradient(135deg, #260a0c 0%, #6e1418 50%, #9b1b1b 100%)",
    image: encodeURI("assets/奶龙帝国成立.webp")
  },
  {
    id: 46,
    title: "奶龙朝圣",
    subtitle: "长路漫漫向圣城行",
    category: "Sacred / Pilgrimage",
    accentColor: "#4CAF7D",
    gradient: "linear-gradient(135deg, #112914 0%, #2e6634 50%, #4caf7d 100%)",
    image: encodeURI("assets/奶龙朝圣.jpeg")
  },
  {
    id: 47,
    title: "奶龙盗火",
    subtitle: "盗取天火照亮人间",
    category: "Mythology / Prometheus",
    accentColor: "#E65C00",
    gradient: "linear-gradient(135deg, #2b1100 0%, #7a3100 50%, #e65c00 100%)",
    image: encodeURI("assets/奶龙盗火.webp")
  },
  {
    id: 48,
    title: "奶龙雷帝杀龙",
    subtitle: "雷霆之怒屠灭凶蛟",
    category: "History / Legend",
    accentColor: "#6A0DAD",
    gradient: "linear-gradient(135deg, #1c0a2e 0%, #461b73 50%, #6a0dad 100%)",
    image: encodeURI("assets/奶龙雷帝杀龙.jpeg")
  },
  {
    id: 49,
    title: "希罗与利安得",
    subtitle: "爱海相隔夜夜泅渡",
    category: "Mythology / Love",
    accentColor: "#1CA9C9",
    gradient: "linear-gradient(135deg, #091e2e 0%, #15456b 50%, #1ca9c9 100%)",
    image: encodeURI("assets/希罗与利安得.webp")
  },
  {
    id: 50,
    title: "带珍珠耳环的奶龙",
    subtitle: "珍珠回眸惊鸿一瞥",
    category: "Baroque / Johannes Vermeer",
    accentColor: "#87A0C0",
    gradient: "linear-gradient(135deg, #161a20 0%, #3a4250 50%, #87a0c0 100%)",
    image: encodeURI("assets/带珍珠耳环的奶龙.jpeg")
  },
  {
    id: 51,
    title: "庞贝城的末日",
    subtitle: "火山灰下永恒定格",
    category: "Romanticism / Karl Bryullov",
    accentColor: "#E25822",
    gradient: "linear-gradient(135deg, #2b0b0e 0%, #781d22 50%, #e25822 100%)",
    image: encodeURI("assets/庞贝城的末日.jpeg")
  },
  {
    id: 52,
    title: "弗朗切斯卡和保罗的影子",
    subtitle: "冥河之风卷入爱欲",
    category: "Romanticism / Dante",
    accentColor: "#5B2C9C",
    gradient: "linear-gradient(135deg, #1c0a2e 0%, #3f1b6e 50%, #5b2c9c 100%)",
    image: encodeURI("assets/弗朗切斯卡和保罗的影子向但丁和维吉尔显现.webp")
  },
  {
    id: 53,
    title: "摩西在西奈山领受律法",
    subtitle: "圣山之上受诫立约",
    category: "Biblical / Moses",
    accentColor: "#7E8BA0",
    gradient: "linear-gradient(135deg, #161a20 0%, #3a4250 50%, #7e8ba0 100%)",
    image: encodeURI("assets/摩西在西奈山领受律法.webp")
  },
  {
    id: 54,
    title: "撑阳伞的奶龙",
    subtitle: "微风拂面阳伞轻扬",
    category: "Impressionism / Claude Monet",
    accentColor: "#4DD0E1",
    gradient: "linear-gradient(135deg, #091e2e 0%, #15456b 50%, #4dd0e1 100%)",
    image: encodeURI("assets/撑阳伞的奶龙.jpeg")
  },
  {
    id: 55,
    title: "星空",
    subtitle: "梵高笔底旋涌星河",
    category: "Post-Impressionism / Van Gogh",
    accentColor: "#E0C341",
    gradient: "linear-gradient(135deg, #0d1626 0%, #1e3a4a 50%, #e0c341 100%)",
    image: encodeURI("assets/星空.jpeg")
  },
  {
    id: 56,
    title: "春光",
    subtitle: "春之女神翩然起舞",
    category: "Renaissance / Sandro Botticelli",
    accentColor: "#8BC34A",
    gradient: "linear-gradient(135deg, #112914 0%, #2e4a34 50%, #8bc34a 100%)",
    image: encodeURI("assets/春光.jpeg")
  },
  {
    id: 57,
    title: "自由引导奶龙",
    subtitle: "红旗所指民众相随",
    category: "Romanticism / Eugène Delacroix",
    accentColor: "#4A90D9",
    gradient: "linear-gradient(135deg, #0d1e33 0%, #204675 50%, #4a90d9 100%)",
    image: encodeURI("assets/自由引导奶龙.jpeg")
  },
  {
    id: 58,
    title: "路西龙审判",
    subtitle: "终审裁决众灵魂列",
    category: "Renaissance / Michelangelo",
    accentColor: "#B8860B",
    gradient: "linear-gradient(135deg, #1a1407 0%, #5e4a1b 50%, #b8860b 100%)",
    image: encodeURI("assets/路西龙审判.webp")
  },
  {
    id: 59,
    title: "路西龙的眼泪",
    subtitle: "堕天之后悔恨之泪",
    category: "Celestial / The Fallen",
    accentColor: "#5E35B1",
    gradient: "linear-gradient(135deg, #1c0a2e 0%, #461b73 50%, #5e35b1 100%)",
    image: encodeURI("assets/路西龙的眼泪.webp")
  },
  {
    id: 60,
    title: "雅各与天使搏斗",
    subtitle: "信仰角力至破晓时",
    category: "Biblical / Genesis",
    accentColor: "#6B7A8F",
    gradient: "linear-gradient(135deg, #161a20 0%, #3a4250 50%, #6b7a8f 100%)",
    image: encodeURI("assets/雅各与天使搏斗.jpeg")
  }
];

if (typeof window !== 'undefined') {
  window.GALLERY_ITEMS = GALLERY_ITEMS;
}
