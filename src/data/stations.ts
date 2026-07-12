// Yamanote Line 30 stations data.
// Sourced from the public dataset at https://www.yamanote.fun/js/stations.js
// Audio files are bundled locally under /public/audio.

export type Direction = 'outer' | 'inner'

export interface Section {
  label: string
  end: number
}

export interface Station {
  jy: string
  name: string
  kanji: string
  audio: Record<Direction, string>
  melody: Record<Direction, string>
  sections: Record<Direction, Section[]>
}

export const stations: Station[] = [
  {
    "jy": "01",
    "name": "Tōkyō",
    "kanji": "東京",
    "audio": {
      "inner": "/audio/JY01-Tokyo-Inner",
      "outer": "/audio/JY01-Tokyo-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 10
        },
        {
          "label": "Door Chime",
          "end": 14
        },
        {
          "label": "Ambience",
          "end": 25.5
        },
        {
          "label": "Announcement",
          "end": 49
        },
        {
          "label": "Ambience",
          "end": 55
        },
        {
          "label": "Door Chime",
          "end": 61.5
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 8.5
        },
        {
          "label": "Door Chime",
          "end": 12
        },
        {
          "label": "Ambience",
          "end": 23.5
        },
        {
          "label": "Announcement",
          "end": 49.5
        },
        {
          "label": "Ambience",
          "end": 54
        },
        {
          "label": "Door Chime",
          "end": 61
        }
      ]
    }
  },
  {
    "jy": "02",
    "name": "Kanda",
    "kanji": "神田",
    "audio": {
      "inner": "/audio/JY02-Kanda-Inner",
      "outer": "/audio/JY02-Kanda-Outer"
    },
    "melody": {
      "inner": "Mondamin Ver.B",
      "outer": "Mondamin Ver.A"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 11
        },
        {
          "label": "Door Chime",
          "end": 15
        },
        {
          "label": "Ambience",
          "end": 21.5
        },
        {
          "label": "Announcement",
          "end": 51
        },
        {
          "label": "Ambience",
          "end": 56.8
        },
        {
          "label": "Door Chime",
          "end": 62
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 10.5
        },
        {
          "label": "Door Chime",
          "end": 14.5
        },
        {
          "label": "Ambience",
          "end": 23
        },
        {
          "label": "Announcement",
          "end": 63
        },
        {
          "label": "Ambience",
          "end": 67
        },
        {
          "label": "Door Chime",
          "end": 74
        }
      ]
    }
  },
  {
    "jy": "03",
    "name": "Akihabara",
    "kanji": "秋葉原",
    "audio": {
      "inner": "/audio/JY03-Akihabara-Inner",
      "outer": "/audio/JY03-Akihabara-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 8.5
        },
        {
          "label": "Door Chime",
          "end": 12.3
        },
        {
          "label": "Ambience",
          "end": 25.5
        },
        {
          "label": "Announcement",
          "end": 49.5
        },
        {
          "label": "Ambience",
          "end": 54
        },
        {
          "label": "Door Chime",
          "end": 61
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 8
        },
        {
          "label": "Door Chime",
          "end": 12
        },
        {
          "label": "Ambience",
          "end": 19.5
        },
        {
          "label": "Announcement",
          "end": 43.5
        },
        {
          "label": "Ambience",
          "end": 49.5
        },
        {
          "label": "Door Chime",
          "end": 58.3
        }
      ]
    }
  },
  {
    "jy": "04",
    "name": "Okachimachi",
    "kanji": "御徒町",
    "audio": {
      "inner": "/audio/JY04-Okachimachi-Inner",
      "outer": "/audio/JY04-Okachimachi-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 10
        },
        {
          "label": "Door Chime",
          "end": 13.6
        },
        {
          "label": "Ambience",
          "end": 16.8
        },
        {
          "label": "Announcement",
          "end": 52.8
        },
        {
          "label": "Ambience",
          "end": 55.5
        },
        {
          "label": "Door Chime",
          "end": 62.2
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 7.8
        },
        {
          "label": "Door Chime",
          "end": 11.1
        },
        {
          "label": "Ambience",
          "end": 16
        },
        {
          "label": "Announcement",
          "end": 45.5
        },
        {
          "label": "Ambience",
          "end": 48.7
        },
        {
          "label": "Door Chime",
          "end": 56.49
        }
      ]
    }
  },
  {
    "jy": "05",
    "name": "Ueno",
    "kanji": "上野",
    "audio": {
      "inner": "/audio/JY05-Ueno-Inner",
      "outer": "/audio/JY05-Ueno-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 9
        },
        {
          "label": "Door Chime",
          "end": 13
        },
        {
          "label": "Ambience",
          "end": 24
        },
        {
          "label": "Announcement",
          "end": 38
        },
        {
          "label": "Ambience",
          "end": 44
        },
        {
          "label": "Door Chime",
          "end": 49.6
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 8.5
        },
        {
          "label": "Door Chime",
          "end": 12
        },
        {
          "label": "Ambience",
          "end": 21.7
        },
        {
          "label": "Announcement",
          "end": 44.5
        },
        {
          "label": "Ambience",
          "end": 49.5
        },
        {
          "label": "Door Chime",
          "end": 54
        },
        {
          "label": "Station Announcement",
          "end": 70
        }
      ]
    }
  },
  {
    "jy": "06",
    "name": "Uguisudani",
    "kanji": "鶯谷",
    "audio": {
      "inner": "/audio/JY06-Uguisudani-Inner",
      "outer": "/audio/JY06-Uguisudani-Outer"
    },
    "melody": {
      "inner": "Spring (Tremolo)",
      "outer": "Babbling Brook"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 11.7
        },
        {
          "label": "Door Chime",
          "end": 15.5
        },
        {
          "label": "Ambience",
          "end": 19.8
        },
        {
          "label": "Announcement",
          "end": 46.3
        },
        {
          "label": "Ambience",
          "end": 52
        },
        {
          "label": "Door Chime",
          "end": 57.7
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 11
        },
        {
          "label": "Door Chime",
          "end": 14.7
        },
        {
          "label": "Ambience",
          "end": 24
        },
        {
          "label": "Announcement",
          "end": 60
        },
        {
          "label": "Ambience",
          "end": 63
        },
        {
          "label": "Door Chime",
          "end": 72.8
        }
      ]
    }
  },
  {
    "jy": "07",
    "name": "Nippori",
    "kanji": "日暮里",
    "audio": {
      "inner": "/audio/JY07-Nippori-Inner",
      "outer": "/audio/JY07-Nippori-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "Babbling Brook"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 12.6
        },
        {
          "label": "Door Chime",
          "end": 16.3
        },
        {
          "label": "Ambience",
          "end": 21.6
        },
        {
          "label": "Announcement",
          "end": 47.6
        },
        {
          "label": "Ambience",
          "end": 52.5
        },
        {
          "label": "Door Chime",
          "end": 58.5
        },
        {
          "label": "Station Announcement",
          "end": 74.3
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 8
        },
        {
          "label": "Door Chime",
          "end": 11.6
        },
        {
          "label": "Ambience",
          "end": 19.3
        },
        {
          "label": "Announcement",
          "end": 33.5
        },
        {
          "label": "Ambience",
          "end": 44.2
        },
        {
          "label": "Door Chime",
          "end": 52
        }
      ]
    }
  },
  {
    "jy": "08",
    "name": "Nishi-Nippori",
    "kanji": "西日暮里",
    "audio": {
      "inner": "/audio/JY08-Nishi-Nippori-Inner",
      "outer": "/audio/JY08-Nishi-Nippori-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 9.8
        },
        {
          "label": "Door Chime",
          "end": 13.3
        },
        {
          "label": "Ambience",
          "end": 22.3
        },
        {
          "label": "Announcement",
          "end": 44
        },
        {
          "label": "Ambience",
          "end": 50
        },
        {
          "label": "Door Chime",
          "end": 55.9
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 7.9
        },
        {
          "label": "Door Chime",
          "end": 11.4
        },
        {
          "label": "Ambience",
          "end": 18.4
        },
        {
          "label": "Announcement",
          "end": 45.6
        },
        {
          "label": "Ambience",
          "end": 52
        },
        {
          "label": "Door Chime",
          "end": 62
        }
      ]
    }
  },
  {
    "jy": "09",
    "name": "Tabata",
    "kanji": "田端",
    "audio": {
      "inner": "/audio/JY09-Tabata-Inner",
      "outer": "/audio/JY09-Tabata-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "Babbling Brook"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 11.7
        },
        {
          "label": "Door Chime",
          "end": 15.7
        },
        {
          "label": "Ambience",
          "end": 26
        },
        {
          "label": "Announcement",
          "end": 71.6
        },
        {
          "label": "Ambience",
          "end": 76.4
        },
        {
          "label": "Door Chime",
          "end": 82.7
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 7.9
        },
        {
          "label": "Door Chime",
          "end": 11.4
        },
        {
          "label": "Ambience",
          "end": 20.7
        },
        {
          "label": "Announcement",
          "end": 46.4
        },
        {
          "label": "Ambience",
          "end": 52
        },
        {
          "label": "Door Chime",
          "end": 59.1
        }
      ]
    }
  },
  {
    "jy": "10",
    "name": "Komagome",
    "kanji": "駒込",
    "audio": {
      "inner": "/audio/JY10-Komagome-Inner",
      "outer": "/audio/JY10-Komagome-Outer"
    },
    "melody": {
      "inner": "Sakura Sakura V2",
      "outer": "Sakura Sakura V1"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 17.6
        },
        {
          "label": "Door Chime",
          "end": 21.1
        },
        {
          "label": "Ambience",
          "end": 34.2
        },
        {
          "label": "Announcement",
          "end": 55
        },
        {
          "label": "Ambience",
          "end": 62
        },
        {
          "label": "Door Chime",
          "end": 69
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 17.6
        },
        {
          "label": "Door Chime",
          "end": 21.3
        },
        {
          "label": "Ambience",
          "end": 30.6
        },
        {
          "label": "Announcement",
          "end": 52
        },
        {
          "label": "Ambience",
          "end": 62.3
        },
        {
          "label": "Door Chime",
          "end": 71.3
        }
      ]
    }
  },
  {
    "jy": "11",
    "name": "Sugamo",
    "kanji": "巣鴨",
    "audio": {
      "inner": "/audio/JY11-Sugamo-Inner",
      "outer": "/audio/JY11-Sugamo-Outer"
    },
    "melody": {
      "inner": "Spring (Standard)",
      "outer": "Babbling Brook"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 11.7
        },
        {
          "label": "Door Chime",
          "end": 15.2
        },
        {
          "label": "Ambience",
          "end": 27.1
        },
        {
          "label": "Announcement",
          "end": 49
        },
        {
          "label": "Ambience",
          "end": 56.2
        },
        {
          "label": "Door Chime",
          "end": 62.7
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 11
        },
        {
          "label": "Door Chime",
          "end": 14.5
        },
        {
          "label": "Ambience",
          "end": 23
        },
        {
          "label": "Announcement",
          "end": 68
        },
        {
          "label": "Ambience",
          "end": 72
        },
        {
          "label": "Door Chime",
          "end": 82
        }
      ]
    }
  },
  {
    "jy": "12",
    "name": "Ōtsuka",
    "kanji": "大塚",
    "audio": {
      "inner": "/audio/JY12-Otsuka-Inner",
      "outer": "/audio/JY12-Otsuka-Outer"
    },
    "melody": {
      "inner": "Spring (Standard)",
      "outer": "Babbling Brook"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 11.9
        },
        {
          "label": "Door Chime",
          "end": 15.6
        },
        {
          "label": "Ambience",
          "end": 26.5
        },
        {
          "label": "Announcement",
          "end": 70.3
        },
        {
          "label": "Ambience",
          "end": 74
        },
        {
          "label": "Door Chime",
          "end": 80.9
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 11.4
        },
        {
          "label": "Door Chime",
          "end": 14.9
        },
        {
          "label": "Ambience",
          "end": 25
        },
        {
          "label": "Announcement",
          "end": 46.2
        },
        {
          "label": "Ambience",
          "end": 55.5
        },
        {
          "label": "Door Chime",
          "end": 64.3
        }
      ]
    }
  },
  {
    "jy": "13",
    "name": "Ikebukuro",
    "kanji": "池袋",
    "audio": {
      "inner": "/audio/JY13-Ikebukuro-Inner",
      "outer": "/audio/JY13-Ikebukuro-Outer"
    },
    "melody": {
      "inner": "Bic Camera Theme Song Ver. A",
      "outer": "Bic Camera Theme Song Ver. C"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 14
        },
        {
          "label": "Door Chime",
          "end": 17.3
        },
        {
          "label": "Ambience",
          "end": 29.7
        },
        {
          "label": "Announcement",
          "end": 42.8
        },
        {
          "label": "Ambience",
          "end": 49.7
        },
        {
          "label": "Door Chime",
          "end": 56
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 12.7
        },
        {
          "label": "Door Chime",
          "end": 16.2
        },
        {
          "label": "Ambience",
          "end": 25
        },
        {
          "label": "Announcement",
          "end": 46.6
        },
        {
          "label": "Ambience",
          "end": 57
        },
        {
          "label": "Door Chime",
          "end": 66.4
        }
      ]
    }
  },
  {
    "jy": "14",
    "name": "Mejiro",
    "kanji": "目白",
    "audio": {
      "inner": "/audio/JY14-Mejiro-Inner",
      "outer": "/audio/JY14-Mejiro-Outer"
    },
    "melody": {
      "inner": "Spring (Standard)",
      "outer": "Babbling Brook"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 11.6
        },
        {
          "label": "Door Chime",
          "end": 15
        },
        {
          "label": "Ambience",
          "end": 24
        },
        {
          "label": "Announcement",
          "end": 50
        },
        {
          "label": "Ambience",
          "end": 59
        },
        {
          "label": "Door Chime",
          "end": 67
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 10.9
        },
        {
          "label": "Door Chime",
          "end": 14.4
        },
        {
          "label": "Ambience",
          "end": 24
        },
        {
          "label": "Announcement",
          "end": 67.3
        },
        {
          "label": "Ambience",
          "end": 72.8
        },
        {
          "label": "Door Chime",
          "end": 81.4
        }
      ]
    }
  },
  {
    "jy": "15",
    "name": "Takadanobaba",
    "kanji": "高田馬場",
    "audio": {
      "inner": "/audio/JY15-Takadanobaba-Inner",
      "outer": "/audio/JY15-Takadanobaba-Outer"
    },
    "melody": {
      "inner": "Astro Boy Ver. B",
      "outer": "Astro Boy Ver.A"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 17
        },
        {
          "label": "Door Chime",
          "end": 21
        },
        {
          "label": "Ambience",
          "end": 29.8
        },
        {
          "label": "Announcement",
          "end": 71
        },
        {
          "label": "Ambience",
          "end": 73.7
        },
        {
          "label": "Door Chime",
          "end": 81.5
        },
        {
          "label": "Station Announcement",
          "end": 95.9
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 15.6
        },
        {
          "label": "Door Chime",
          "end": 19
        },
        {
          "label": "Ambience",
          "end": 26.6
        },
        {
          "label": "Announcement",
          "end": 39.3
        },
        {
          "label": "Ambience",
          "end": 52
        },
        {
          "label": "Door Chime",
          "end": 59.6
        }
      ]
    }
  },
  {
    "jy": "16",
    "name": "Shin-Ōkubo",
    "kanji": "新大久保",
    "audio": {
      "inner": "/audio/JY16-Shin-Okubo-Inner",
      "outer": "/audio/JY16-Shin-Okubo-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 9.3
        },
        {
          "label": "Door Chime",
          "end": 13
        },
        {
          "label": "Ambience",
          "end": 20
        },
        {
          "label": "Announcement",
          "end": 65.4
        },
        {
          "label": "Ambience",
          "end": 72.4
        },
        {
          "label": "Door Chime",
          "end": 78.3
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 7.8
        },
        {
          "label": "Door Chime",
          "end": 11.4
        },
        {
          "label": "Ambience",
          "end": 19
        },
        {
          "label": "Announcement",
          "end": 45
        },
        {
          "label": "Ambience",
          "end": 57
        },
        {
          "label": "Door Chime",
          "end": 65.5
        }
      ]
    }
  },
  {
    "jy": "17",
    "name": "Shinjuku",
    "kanji": "新宿",
    "audio": {
      "inner": "/audio/JY17-Shinjuku-Inner",
      "outer": "/audio/JY17-Shinjuku-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 8.2
        },
        {
          "label": "Door Chime",
          "end": 11.7
        },
        {
          "label": "Ambience",
          "end": 24.9
        },
        {
          "label": "Announcement",
          "end": 46.3
        },
        {
          "label": "Ambience",
          "end": 54.6
        },
        {
          "label": "Door Chime",
          "end": 61.2
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 7.6
        },
        {
          "label": "Door Chime",
          "end": 11
        },
        {
          "label": "Ambience",
          "end": 20
        },
        {
          "label": "Announcement",
          "end": 61
        },
        {
          "label": "Ambience",
          "end": 64.8
        },
        {
          "label": "Door Chime",
          "end": 73.9
        }
      ]
    }
  },
  {
    "jy": "18",
    "name": "Yoyogi",
    "kanji": "代々木",
    "audio": {
      "inner": "/audio/JY18-Yoyogi-Inner",
      "outer": "/audio/JY18-Yoyogi-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 9.3
        },
        {
          "label": "Door Chime",
          "end": 12.9
        },
        {
          "label": "Ambience",
          "end": 26
        },
        {
          "label": "Announcement",
          "end": 47.3
        },
        {
          "label": "Ambience",
          "end": 55.7
        },
        {
          "label": "Door Chime",
          "end": 62.7
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 7.9
        },
        {
          "label": "Door Chime",
          "end": 11.3
        },
        {
          "label": "Ambience",
          "end": 19.6
        },
        {
          "label": "Announcement",
          "end": 64.7
        },
        {
          "label": "Ambience",
          "end": 74.4
        },
        {
          "label": "Door Chime",
          "end": 81.7
        }
      ]
    }
  },
  {
    "jy": "19",
    "name": "Harajuku",
    "kanji": "原宿",
    "audio": {
      "inner": "/audio/JY19-Harajuku-Inner",
      "outer": "/audio/JY19-Harajuku-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 9.8
        },
        {
          "label": "Door Chime",
          "end": 13.6
        },
        {
          "label": "Ambience",
          "end": 22.1
        },
        {
          "label": "Announcement",
          "end": 72.5
        },
        {
          "label": "Ambience",
          "end": 80
        },
        {
          "label": "Door Chime",
          "end": 86.9
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 8
        },
        {
          "label": "Door Chime",
          "end": 11.6
        },
        {
          "label": "Ambience",
          "end": 24
        },
        {
          "label": "Announcement",
          "end": 45.3
        },
        {
          "label": "Ambience",
          "end": 58
        },
        {
          "label": "Door Chime",
          "end": 65.8
        }
      ]
    }
  },
  {
    "jy": "20",
    "name": "Shibuya",
    "kanji": "渋谷",
    "audio": {
      "inner": "/audio/JY20-Shibuya-Inner",
      "outer": "/audio/JY20-Shibuya-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 9
        },
        {
          "label": "Door Chime",
          "end": 12.7
        },
        {
          "label": "Ambience",
          "end": 25
        },
        {
          "label": "Announcement",
          "end": 50
        },
        {
          "label": "Ambience",
          "end": 55.5
        },
        {
          "label": "Door Chime",
          "end": 62.9
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 8.4
        },
        {
          "label": "Door Chime",
          "end": 12
        },
        {
          "label": "Ambience",
          "end": 22.5
        },
        {
          "label": "Announcement",
          "end": 43.7
        },
        {
          "label": "Ambience",
          "end": 56.5
        },
        {
          "label": "Door Chime",
          "end": 62.5
        },
        {
          "label": "Station Announcement",
          "end": 79.3
        }
      ]
    }
  },
  {
    "jy": "21",
    "name": "Ebisu",
    "kanji": "恵比寿",
    "audio": {
      "inner": "/audio/JY21-Ebisu-Inner",
      "outer": "/audio/JY21-Ebisu-Outer"
    },
    "melody": {
      "inner": "The Third Man Ver.F",
      "outer": "The Third Man Ver.E"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 12.6
        },
        {
          "label": "Door Chime",
          "end": 16
        },
        {
          "label": "Ambience",
          "end": 25.9
        },
        {
          "label": "Announcement",
          "end": 54
        },
        {
          "label": "Ambience",
          "end": 59
        },
        {
          "label": "Door Chime",
          "end": 67.2
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 12
        },
        {
          "label": "Door Chime",
          "end": 15.6
        },
        {
          "label": "Ambience",
          "end": 28.7
        },
        {
          "label": "Announcement",
          "end": 78.6
        },
        {
          "label": "Ambience",
          "end": 84.5
        },
        {
          "label": "Door Chime",
          "end": 90.5
        }
      ]
    }
  },
  {
    "jy": "22",
    "name": "Meguro",
    "kanji": "目黒",
    "audio": {
      "inner": "/audio/JY22-Meguro-Inner",
      "outer": "/audio/JY22-Meguro-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 9.3
        },
        {
          "label": "Door Chime",
          "end": 12.9
        },
        {
          "label": "Ambience",
          "end": 24.2
        },
        {
          "label": "Announcement",
          "end": 49.7
        },
        {
          "label": "Ambience",
          "end": 55.6
        },
        {
          "label": "Door Chime",
          "end": 62
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 10
        },
        {
          "label": "Door Chime",
          "end": 13.5
        },
        {
          "label": "Ambience",
          "end": 25
        },
        {
          "label": "Announcement",
          "end": 50
        },
        {
          "label": "Ambience",
          "end": 62
        },
        {
          "label": "Door Chime",
          "end": 69.8
        }
      ]
    }
  },
  {
    "jy": "23",
    "name": "Gotanda",
    "kanji": "五反田",
    "audio": {
      "inner": "/audio/JY23-Gotanda-Inner",
      "outer": "/audio/JY23-Gotanda-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 9.5
        },
        {
          "label": "Door Chime",
          "end": 13.1
        },
        {
          "label": "Ambience",
          "end": 23.8
        },
        {
          "label": "Announcement",
          "end": 51.6
        },
        {
          "label": "Ambience",
          "end": 56.1
        },
        {
          "label": "Door Chime",
          "end": 63.2
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 9.3
        },
        {
          "label": "Door Chime",
          "end": 13
        },
        {
          "label": "Ambience",
          "end": 22.7
        },
        {
          "label": "Announcement",
          "end": 51.2
        },
        {
          "label": "Ambience",
          "end": 63.8
        },
        {
          "label": "Door Chime",
          "end": 70
        },
        {
          "label": "Station Announcement",
          "end": 84.8
        }
      ]
    }
  },
  {
    "jy": "24",
    "name": "Ōsaki",
    "kanji": "大崎",
    "audio": {
      "inner": "/audio/JY24-Osaki-Inner",
      "outer": "/audio/JY24-Osaki-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 9.3
        },
        {
          "label": "Door Chime",
          "end": 13
        },
        {
          "label": "Ambience",
          "end": 22.5
        },
        {
          "label": "Announcement",
          "end": 64.6
        },
        {
          "label": "Ambience",
          "end": 90.5
        },
        {
          "label": "Door Chime",
          "end": 97.2
        },
        {
          "label": "Station Announcement",
          "end": 111.4
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 8
        },
        {
          "label": "Door Chime",
          "end": 11.5
        },
        {
          "label": "Ambience",
          "end": 22
        },
        {
          "label": "Announcement",
          "end": 47.4
        },
        {
          "label": "Ambience",
          "end": 54
        },
        {
          "label": "Door Chime",
          "end": 59.4
        }
      ]
    }
  },
  {
    "jy": "25",
    "name": "Shinagawa",
    "kanji": "品川",
    "audio": {
      "inner": "/audio/JY25-Shinagawa-Inner",
      "outer": "/audio/JY25-Shinagawa-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 9
        },
        {
          "label": "Door Chime",
          "end": 12.7
        },
        {
          "label": "Ambience",
          "end": 25.2
        },
        {
          "label": "Announcement",
          "end": 74.8
        },
        {
          "label": "Ambience",
          "end": 78.8
        },
        {
          "label": "Door Chime",
          "end": 85.5
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 8
        },
        {
          "label": "Door Chime",
          "end": 11.5
        },
        {
          "label": "Ambience",
          "end": 20.3
        },
        {
          "label": "Announcement",
          "end": 48
        },
        {
          "label": "Ambience",
          "end": 54
        },
        {
          "label": "Door Chime",
          "end": 62.1
        }
      ]
    }
  },
  {
    "jy": "26",
    "name": "Takanawa Gateway",
    "kanji": "高輪ゲートウェイ",
    "audio": {
      "inner": "/audio/JY26-Takanawa-Gateway-Inner",
      "outer": "/audio/JY26-Takanawa-Gateway-Outer"
    },
    "melody": {
      "inner": "Glorious Gateway Ver.A",
      "outer": "Glorious Gateway Ver.B"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 12.6
        },
        {
          "label": "Door Chime",
          "end": 16.3
        },
        {
          "label": "Ambience",
          "end": 20
        },
        {
          "label": "Announcement",
          "end": 68.3
        },
        {
          "label": "Ambience",
          "end": 74.2
        },
        {
          "label": "Door Chime",
          "end": 81.1
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 8.4
        },
        {
          "label": "Door Chime",
          "end": 12.6
        },
        {
          "label": "Ambience",
          "end": 18.9
        },
        {
          "label": "Announcement",
          "end": 80.5
        },
        {
          "label": "Ambience",
          "end": 83.8
        },
        {
          "label": "Door Chime",
          "end": 93.3
        }
      ]
    }
  },
  {
    "jy": "27",
    "name": "Tamachi",
    "kanji": "田町",
    "audio": {
      "inner": "/audio/JY27-Tamachi-Inner",
      "outer": "/audio/JY27-Tamachi-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 9.5
        },
        {
          "label": "Door Chime",
          "end": 13
        },
        {
          "label": "Ambience",
          "end": 24.7
        },
        {
          "label": "Announcement",
          "end": 52
        },
        {
          "label": "Ambience",
          "end": 64.9
        },
        {
          "label": "Door Chime",
          "end": 70.5
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 7.8
        },
        {
          "label": "Door Chime",
          "end": 11.5
        },
        {
          "label": "Ambience",
          "end": 16.5
        },
        {
          "label": "Announcement",
          "end": 66.3
        },
        {
          "label": "Ambience",
          "end": 69.7
        },
        {
          "label": "Door Chime",
          "end": 77.3
        }
      ]
    }
  },
  {
    "jy": "28",
    "name": "Hamamatsuchō",
    "kanji": "浜松町",
    "audio": {
      "inner": "/audio/JY28-Hamamatsucho-Inner",
      "outer": "/audio/JY28-Hamamatsucho-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 9.6
        },
        {
          "label": "Door Chime",
          "end": 13.1
        },
        {
          "label": "Ambience",
          "end": 24.3
        },
        {
          "label": "Announcement",
          "end": 53.2
        },
        {
          "label": "Ambience",
          "end": 65
        },
        {
          "label": "Door Chime",
          "end": 71
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 8.5
        },
        {
          "label": "Door Chime",
          "end": 12
        },
        {
          "label": "Ambience",
          "end": 20.6
        },
        {
          "label": "Announcement",
          "end": 68.5
        },
        {
          "label": "Ambience",
          "end": 73
        },
        {
          "label": "Door Chime",
          "end": 82.3
        }
      ]
    }
  },
  {
    "jy": "29",
    "name": "Shimbashi",
    "kanji": "新橋",
    "audio": {
      "inner": "/audio/JY29-Shimbashi-Inner",
      "outer": "/audio/JY29-Shimbashi-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 9.2
        },
        {
          "label": "Door Chime",
          "end": 13
        },
        {
          "label": "Ambience",
          "end": 23.9
        },
        {
          "label": "Announcement",
          "end": 50
        },
        {
          "label": "Ambience",
          "end": 61.4
        },
        {
          "label": "Door Chime",
          "end": 64.9
        },
        {
          "label": "Station Announcement",
          "end": 82.7
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 7.9
        },
        {
          "label": "Door Chime",
          "end": 11.5
        },
        {
          "label": "Ambience",
          "end": 21.6
        },
        {
          "label": "Announcement",
          "end": 49.2
        },
        {
          "label": "Ambience",
          "end": 53.8
        },
        {
          "label": "Door Chime",
          "end": 63.5
        }
      ]
    }
  },
  {
    "jy": "30",
    "name": "Yūrakuchō",
    "kanji": "有楽町",
    "audio": {
      "inner": "/audio/JY30-Yurakucho-Inner",
      "outer": "/audio/JY30-Yurakucho-Outer"
    },
    "melody": {
      "inner": "JRE-IKST-010-01",
      "outer": "JRE-IKST-010-02"
    },
    "sections": {
      "outer": [
        {
          "label": "Melody",
          "end": 8.7
        },
        {
          "label": "Door Chime",
          "end": 12.3
        },
        {
          "label": "Ambience",
          "end": 19.3
        },
        {
          "label": "Announcement",
          "end": 59.2
        },
        {
          "label": "Ambience",
          "end": 65.9
        },
        {
          "label": "Door Chime",
          "end": 72.1
        }
      ],
      "inner": [
        {
          "label": "Melody",
          "end": 7.8
        },
        {
          "label": "Door Chime",
          "end": 11.5
        },
        {
          "label": "Ambience",
          "end": 20
        },
        {
          "label": "Announcement",
          "end": 48.6
        },
        {
          "label": "Ambience",
          "end": 53.8
        },
        {
          "label": "Door Chime",
          "end": 63.2
        }
      ]
    }
  }
]
