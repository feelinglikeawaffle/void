/* ============================
   SHOP DEFINITIONS
   ============================ */

const shopDefs = {
  resource: [
    {
      id: "res_gain_1",
      name: "Basic Resource Boost",
      desc: "Increase all skill XP gain by 10%.",
      baseCost: 50,
      currency: "dust",
      effect: (state) => {
        state.multipliers.skillXp *= 1.10;
      }
    },
    {
      id: "res_gain_2",
      name: "Improved Resource Boost",
      desc: "Increase all skill XP gain by 25%.",
      baseCost: 200,
      currency: "dust",
      effect: (state) => {
        state.multipliers.skillXp *= 1.25;
      }
    }
  ],

  void: [
    {
      id: "void_eff_1",
      name: "Void Efficiency",
      desc: "Void actions generate 20% more Void.",
      baseCost: 10,
      currency: "void",
      effect: (state) => {
        state.multipliers.voidGain *= 1.20;
      }
    },
    {
      id: "void_eff_2",
      name: "Void Surge",
      desc: "Void actions generate 50% more Void.",
      baseCost: 50,
      currency: "void",
      effect: (state) => {
        state.multipliers.voidGain *= 1.50;
      }
    }
  ],

  ascend: [
    {
      id: "ascend_boost_1",
      name: "Ascendant Knowledge",
      desc: "Increase all XP gain by 50%.",
      baseCost: 5,
      currency: "ascend",
      effect: (state) => {
        state.multipliers.skillXp *= 1.50;
      }
    }
  ],

  transcend: [
    {
      id: "transcend_power_1",
      name: "Transcendent Power",
      desc: "Double all XP gain.",
      baseCost: 1,
      currency: "transcend",
      effect: (state) => {
        state.multipliers.skillXp *= 2;
      }
    }
  ],

  eternal: [
    {
      id: "eternal_flame",
      name: "Eternal Flame",
      desc: "Massively increase all XP gain (x5).",
      baseCost: 1,
      currency: "eternal",
      effect: (state) => {
        state.multipliers.skillXp *= 5;
      }
    }
  ]
};
