window.addEventListener('load', function () {
  const app = new PIXI.Application(700, 500, {backgroundColor: 0xffffff});
  const parent = document.querySelector('.app');
  parent.appendChild(app.view);
  PIXI.loader.add('gerald', 'master-rig.json')
    .load(onGeraldLoaded);
  function onGeraldLoaded(loader, res) {
    const gerald = new PIXI.spine.Spine(res.gerald.spineData);
    gerald.scale.set(0.3, 0.3);
    gerald.position.set(app.screen.width / 2, app.screen.height / 1.2);
    gerald.skeleton.setToSetupPose();
    gerald.state.setAnimation(0, 'DANCING-ACTIVE', true, 1);
    gerald.skeleton.setSkinByName('full-gerald');
    app.stage.addChild(gerald);
    generateSkinButtons(gerald);
    this.gerald = gerald;
    this.addedPartialSkins = [];
  }
  function changeAvatarSkin(skin) {
    this.gerald.skeleton.setSkin(null);
    this.gerald.skeleton.setSkinByName(skin);
  }
  function generateSkinButtons(gerald){
    const skins = [];
    for (const skinName of gerald.spineData.skins) {
      Object.entries(skinName).forEach(
        ([key, value]) => {
          if (key === 'name' && value !== 'default') {
            skins.push(value);
          }
      });
    }
    const list = document.querySelector('ul.skins');
    // skins.forEach((skin)=>{
    //   console.log(skin)
    //   const li = document.createElement('li');
    //   const button = document.createElement('button');
    //   li.appendChild(button);
    //   button.innerHTML = skin;
    //   list.appendChild(li);
    //   button.onclick = function() {
    //     changeAvatarSkin(skin);
    //   }
    // });
    const equipButton = document.createElement('button');
    equipButton.innerText = 'Equip Brows';
    equipButton.onclick = function(){
      equipPartialSkin('brows-large');
    }
    const equipMain = document.createElement('button');
    equipMain.innerText = 'Equip Gerald';
    equipMain.onclick = function(){
      equipBaseSkin('full-gerald');
    }
    document.querySelector('.test').appendChild(equipMain);
    document.querySelector('.test').appendChild(equipButton);
  }
  function equipPartialSkin(skinname){
    this.templatePartialSkin = this.gerald.skeleton.data.findSkin(skinname);
    if (this.templatePartialSkin !== null) {
      this.addedPartialSkins.push(this.templatePartialSkin);
    }
    refreshSkin();
  }
  function equipBaseSkin(skinname) {
    this.templateBaseSkin = this.gerald.skeleton.data.findSkin(skinname);
    refreshSkin();
  }
  function refreshSkin() {
    recombineSkin();
    this.gerald.skeleton.skin = this.combinedSkin;
    refreshSkeletonAttachments();
  }
  function recombineSkin(){
    this.combinedSkin = new PIXI.spine.core.Skin('CombinedSkin');
    // "AddAtachments" doesn't appear to be a method in spine-ts or pixi-spine,
    // the equivalent seems to be "attachAll?" Unsure.
    this.combinedSkin.attachAll(this.gerald.skeleton, this.templateBaseSkin);
    for (const partialSkin of this.addedPartialSkins) {
      this.combinedSkin.attachAll(this.gerald.skeleton, partialSkin);
    }
  }
  function refreshSkeletonAttachments() {
    // Had to comment this out, as using it would wipe out the entire character
    // this.gerald.skeleton.setSlotsToSetupPose();
    this.gerald.state.apply(this.gerald.skeleton);
  }
});
