class place {
  constructor(title, imageUri, address, location) {
    this.title = title;
    this.imageUri = imageUri;
    this.address = address;
    this.location = location; //{lat:0.123578, lng:123.541422}
    this.id = new Date().toString() + Math.random.toString();
  }
}
