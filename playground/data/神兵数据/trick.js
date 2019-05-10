module.exports  = {
  getSkillChapterProps, getSkillLevelProps
};

function getSkillLevelProps(sbId, level) {
  switch (sbId) {
  case 1:
    return {
      ldAP: 0.3 * level
    };
  case 2:
    return {
      qjAP: 0.3 * level
    };
  case 3:
    return {
      ggAP: 0.3 * level
    };
  case 4:
    return {
      dcAP: 0.3 * level
    };
  case 5:
    return {
      sfAP: 0.3 * level
    };
  case 6:
    return {
      wgWeak: 40 * level,
      ngWeak: 20 * level
    };
  case 7:
    return {
      wgAP: 0.5 * level,
      ngAP: 0.5 * level
    };
  case 8:
    return {
      wfWeak: 40 * level,
      nfWeak: 40 * level
    };
  case 9:
    return {
      wfAP: 0.5 * level,
      nfAP: 0.5 * level
    };
  case 10:
    return {
      mz: 1 * level,
      gd: 1 * level
    };
  case 11:
    // 使用饮血技时，触发花魂绽放效果，造成额外的伤害。本级使额外伤害再获得一定提升。<br>被动触发，调息时间为30秒。
    return '使用饮血技时触发花魂绽放效果，造成额外的伤害。被动cd为30秒';
  case 12:
    // 当主动释放无念时，在无念状态下增加自身增加自身内功攻击500点，外功攻击1000点 ng 400+100*l, wg 800+200*l
    return `主动释放无念时，无念状态下增加自身内攻${400+100*level}点，外攻${800+200*level}点`;
  case 13:
    return {
      wgAP: 0.3 * level,
      ngAP: 0.3 * level,
      wfAP: 0.3 * level,
      nfAP: 0.3 * level,
    };
  case 14:
    return {
      qxAP: 0.5 * level,
    };
  }
}

// 注意，需要累加效果
function getSkillChapterProps(sbId, chapter) {
  switch (sbId) {
  case 1:
    return {
      ldAP: 0.5 * chapter
    };
  case 2:
    return {
      qjAP: 0.5 * chapter
    };
  case 3:
    return {
      ggAP: 0.5 * chapter
    };
  case 4:
    return {
      dcAP: 0.5 * chapter
    };
  case 5:
    return {
      sfAP: 0.5 * chapter
    };
  case 6:
    switch (chapter) {
    case 1:
      return {
        ngWeak: 20
      };
    case 2:
      return {
        wgWeak: 40
      };
    case 3:
      return {
        ngWeak: 60
      };
    case 4:
      return {
        wgWeak: 120
      };
    }
    return -1;
  case 7:
    switch (chapter) {
    case 1:
      return {
        ngAP: 0.5
      };
    case 2:
      return {
        wgAP: 0.5
      };
    case 3:
      return {
        ngAP: 1.5
      };
    case 4:
      return {
        wgAP: 1.5
      };
    }
    return -1;
  case 8:
    switch (chapter) {
    case 1:
      return {
        nfWeak: 20
      };
    case 2:
      return {
        wfWeak: 40
      };
    case 3:
      return {
        nfWeak: 60
      };
    case 4:
      return {
        wfWeak: 120
      };
    }
    return -1;
  case 9:
    switch (chapter) {
    case 1:
      return {
        nfAP: 0.5
      };
    case 2:
      return {
        wfAP: 0.5
      };
    case 3:
      return {
        nfAP: 1.5
      };
    case 4:
      return {
        wfAP: 1.5
      };
    }
    return -1;
  case 10:
    return {};
  case 11:
    return {};
  case 12:
    return {};
  case 13:
    if(chapter === 1)
      return {
        ngAP: 1,
        wgAP: 1
      };
    else return {};
  case 14:
    if(chapter === 1)
      return {
        yushang: 30,
        chaizhao: 30
      };
    else return {};
  }
}