window.addEventListener('load', function () {
  const app = new PIXI.Application(700, 500, {
    backgroundColor: 0xffffff
  });
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
    // gerald.skeleton.setSkinByName('full-gerald');
    app.stage.addChild(gerald);
    generateSkinButtons(gerald);
    this.gerald = gerald;
    this.addedPartialSkins = [];
    equipBaseSkin('full-gerald')
  }

  function changeAvatarSkin(skin) {
    this.gerald.skeleton.setSkin(null);
    this.gerald.skeleton.setSkinByName(skin);
  }

  function generateSkinButtons(gerald) {
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
    skins.forEach((skin)=>{
      const li = document.createElement('li');
      const button = document.createElement('button');
      li.appendChild(button);
      button.innerHTML = skin;
      list.appendChild(li);
      button.onclick = function() {
        equipPartialSkin(skin);
      }
    });
 }

  function equipPartialSkin(skinname) {
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
    this.gerald.skeleton.setSkin(this.combinedSkin);
    refreshSkeletonAttachments();
  }

  function recombineSkin() {
    this.combinedSkin = new PIXI.spine.core.Skin('CombinedSkin');
    // "AddAtachments" doesn't appear to be a method in spine-ts or pixi-spine,
    // the equivalent seems to be "attachAll?" Unsure.
    addAttachments(this.templateBaseSkin, combinedSkin);
    // this.combinedSkin.attachAll(this.gerald.skeleton, this.templateBaseSkin);
    for (const partialSkin of this.addedPartialSkins) {
      addAttachments(partialSkin, this.combinedSkin);
    }
  }

  function refreshSkeletonAttachments() {
    // Had to comment this out, as using it would wipe out the entire character
    this.gerald.skeleton.setSlotsToSetupPose();
    this.gerald.state.apply(this.gerald.skeleton);
  }

  function addAttachments(srcSkin, dstSkin) {
    for (var slotIndex = 0; slotIndex < srcSkin.attachments.length; slotIndex++) {
      if (srcSkin.attachments[slotIndex] != null) {
        var names = Object.keys(srcSkin.attachments[slotIndex]);
        for (var nameIndex = 0; nameIndex < names.length; nameIndex++) {
          name = names[nameIndex];
          if (name != null) {
            dstSkin.addAttachment(parseInt(slotIndex), name, srcSkin.attachments[slotIndex][name]);
          }
        }
      }
    }
  }
});