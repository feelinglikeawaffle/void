/* ============================
   SKILL DEFINITIONS
   ============================ */

const skillDefs = [
  {
    id: "gather_dust",
    name: "Gather Dust",
    desc: "Manually gather dust over time.",
    baseXpPerSecond: 1,
    unlockedByDefault: true,
    unlockReq: null
  },
  {
    id: "focus_void",
    name: "Focus Void",
    desc: "Channel void energy to increase void gain.",
    baseXpPerSecond: 0.5,
    unlockedByDefault: false,
    unlockReq: {
      type: "resource",
      resource: "dust",
      amount: 100,
      text: "Requires 100 Dust to unlock."
    }
  },
  {
    id: "ascend_mind",
    name: "Ascend Mind",
    desc: "Train your mind to improve all XP gain.",
    baseXpPerSecond: 0.2,
    unlockedByDefault: false,
    unlockReq: {
      type: "resource",
      resource: "void",
      amount: 50,
      text: "Requires 50 Void to unlock."
    }
  }
];
