import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type LandSamuraiState = {
  name: string;
  samurai: number;
  power: number;
};

export type LandState = {
  war_id: number;
  id: number;
  name: string;
  owner: string;
  desc: string;
  uri: string;
  value: number;
  roads: string;
  attackerClan: number;
  lastWarTime: number;
  clan: number;
  attackersPower: number;
  defendersPower: number;
  attackerSamurai: LandSamuraiState[];
  defenderSamurai: LandSamuraiState[];
};

export type ClanState = {
  lightStones: number;
  ID: number;
  baseLocation: number;
};

export type GameState = {
  clan: number;
  samurai?: any;
  land?: LandState;
  deck: any[];
  isLoaded: boolean;
  lands: LandState[];
  clans: ClanState[];
};

export const initialState: GameState = {
  clan: 0,
  samurai: null,
  land: null,
  deck: [],
  isLoaded: false,
  lands: [],
  clans: [],
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setSamurai: (state, action: PayloadAction<any>) => {
      state.samurai = action.payload;
    },
    setLand: (state, action: PayloadAction<LandState>) => {
      state.land = action.payload;
    },
    setDeck: (state, action: PayloadAction<any[]>) => {
      state.deck = action.payload;
    },
    setLands: (state, action: PayloadAction<LandState[]>) => {
      state.lands = action.payload;
    },
    setClans: (state, action: PayloadAction<ClanState[]>) => {
      state.clans = action.payload;
    },
    addDeck: (state, action: PayloadAction<any>) => {
      state.deck.push(action.payload);
    },
    removeDeck: (state, action: PayloadAction<any>) => {
      state.deck = state.deck.filter((card) => card.id !== action.payload.id);
    },
    updateOrCreateDeck: (state, action: PayloadAction<any>) => {
      const cardIndex = state.deck.findIndex(
        (card) => card.id === action.payload.id,
      );
      if (cardIndex === -1) {
        state.deck.push(action.payload);
      } else {
        state.deck[cardIndex] = action.payload;
      }
    },
  },
});

export const {
  setSamurai,
  setDeck,
  setLand,
  setLands,
  setClans,
  addDeck,
  removeDeck,
  updateOrCreateDeck,
} = gameSlice.actions;

export default gameSlice.reducer;
