const mockDataService = {
  genres: [
    {
      id: "1",
      name: "Rock",
      imageUrl:
        "https://images.pexels.com/photos/4785053/pexels-photo-4785053.jpeg",
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Pop",
      imageUrl:
        "https://images.pexels.com/photos/4321920/pexels-photo-4321920.jpeg",
      createdAt: new Date(),
    },
    {
      id: "3",
      name: "Jazz",
      imageUrl:
        "https://images.pexels.com/photos/32894136/pexels-photo-32894136.jpeg",
      createdAt: new Date(),
    },
  ],
  artists: [
    {
      id: "1",
      name: "The Beatles",
      imageUrl: "https://via.placeholder.com/150?text=Beatles",
      genreId: "1",
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Queen",
      imageUrl: "https://via.placeholder.com/150?text=Queen",
      genreId: "1",
      createdAt: new Date(),
    },
    {
      id: "3",
      name: "Taylor Swift",
      imageUrl: "https://via.placeholder.com/150?text=Taylor",
      genreId: "2",
      createdAt: new Date(),
    },
  ],
  songs: [
    {
      id: "1",
      name: "Hey Jude",
      audioImageUrl:
        "https://images.pexels.com/photos/4785053/pexels-photo-4785053.jpeg",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
      artistId: "1",
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Let It Be",
      audioImageUrl:
        "https://images.pexels.com/photos/4785053/pexels-photo-4785053.jpeg",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
      artistId: "1",
      createdAt: new Date(),
    },
    {
      id: "3",
      name: "Bohemian Rhapsody",
      audioImageUrl:
        "https://images.pexels.com/photos/4785053/pexels-photo-4785053.jpeg",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
      artistId: "2",
      createdAt: new Date(),
    },
  ],
};

export default mockDataService;
