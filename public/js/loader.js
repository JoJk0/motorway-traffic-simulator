function loadApp(){
  //load an image and run the `setup` function when it's done
  loader
  .add("img/sprites/car.png")
  .add("img/sprites/tailgater.png")
  .add("img/sprites/boy-racer.png")
  .add("img/sprites/sunday-driver.png")
  .add("img/sprites/ambulance.png")
  .add("img/sprites/fire.png")
  .add("img/sprites/police-car.png")
  .add("img/sprites/lorry.png")
  .on("progress", loadProgressHandler)
  .load(setup);
}