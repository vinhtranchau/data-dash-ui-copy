export enum PlotlyGraphTypes {
  Scatter = 'scatter',
  Box = 'box',
  ScatterGl = 'scattergl',
  Bar = 'bar',
  Histogram = 'histogram',
  Sunburst = 'sunburst',
  Candlestick = 'candlestick',
  Line = 'line',
  Pie = 'pie',
}

export enum PlotlyModeTypes {
  Lines = 'lines',
  Markers = 'markers',
  LinesAndMarkers = 'lines+markers',
}

export enum PlotlyAxisTypes {
  Y = 'y',
  X = 'x',
  Y2 = 'y2',
  X2 = 'x2',
}

export enum PlotlyLineDashTypes {
  Solid = 'solid',
  Dash = 'dash',
  DashDot = 'dashdot',
  Dot = 'dot',
}

export enum PlotlyHoverInfoTypes {
  LabelAndPercent = 'label+percent',
  Percent = 'percent',
  LabelAndValue = 'label+value',
  Skip = 'skip',
}

export enum PlotlyTraceColors {
  Primary100 = '#A8E6CE',
  Primary200 = '#DCEDC2',
  Secondary = '#FFD3B5',
  Accent100 = '#FF8C94',
  Accent200 = '#FFAAA6',
  MidnightBlue = '#1D263A',
  Dark = '#355C7D',
  Black = 'black',
  Gray = 'gray',
  White = 'white',
  Transparent = 'rgba(255,255,255,0)',
  TransparentGray = 'rgba(0,0,0,0.2)',
  TransparentPrimary = 'rgba(255, 211, 181, 0.35)',
  TransparentPrimary200 = 'rgba(255, 211, 181, 0.15)',
  Gold = '#E7D27C',
  CalmingBlue = '#9FCAE5',
  SoftPurple = '#AF8FE9',
  Turquoise = '#7CADAC',
  SoftBlue = '#93CAED',
  Lavender = '#D7B4F3',
  Orange = '#FBBB62',
  NavyBlue = '#5E5CB2',
  Green = '#BEE5B0',
  Mint = '#9ADBB3',
  BabyBlue = '#89CFF0',
  YellowPantone = '#F2E6B1',
  Teal = '#63B7B7',
  RoseGold = '#C79098',
  Snow = '#E5ECF8',
  Coral = '#FFA38C',
  Pink = '#F0B6D5',
  Cream = '#FFFEE0',
  Brown = '#B1907F',
  Purple = '#9A7FAE',
  RedRose = '#E5788F',
  Aquamarine = '#B0E9D5',
  Beige = '#D4C6AA',
  Magenta = '#D27EDF',
  Burgundy = '#974C5E',
  Chocolate = '#A7796D',
  Yellow = '#E69D51',
  Blond = '#FFF8D5',
  Taupe = '#75655A',
  Silver = '#DBDBDC',
  Blush = '#E79AAC',
  Maroon = '#944547',
  Lilac = '#C991DF',
  Ochre = '#D69759',
  Cyan = '#A4D8D8',
  WineRed = '#C25964',
  Tulip = '#FFA4A9',
  Pearl = '#F0EBD8',
  Blue = '#6792AC',
  Lemon = '#F6F3A9',
  Sand = '#D3C7A2',
  Cherry = '#E56E90',
  DarkIndigo = '#543E7A',
  Olive = '#BCBC82',
  Nude = '#E7D7CA',
  SnowBlue = '#C9D6E8',
  OrangeRAL = '#F17829',
  DarkGold = '#BBA151',
  GrassGreen = '#9ECB91',
  Rust = '#D05C39',
  Grape = '#A16AD1',
  Caramel = '#FFDDB3',
  Berry = '#ED8698',
  Coffee = '#D0A48D',
  Khaki = '#DAD4B6',
  Champagne = '#FCF1DC',
  Mauve = '#EBCCFF',
  Cinnamon = '#CFAC94',
  Peach = '#F7DFC2',
  Denim = '#AFC0EA',
  Indigo = '#8686AF',
  RetroYellow = '#F2E8BF',
  Tan = '#E9C9AA',
  Blood = '#BD5F60',
  BlueGreen = '#A5E3E0',
  Lime = '#D1FEB8',
  Amber = '#F8C57C',
  Earth = '#D7CAB7',
  Skin = '#EFDFD8',
  Rose = '#F6B8D0',
  Pistachio = '#D0E9C0',
  Ocean = '#6ECDDB',
  Salmon = '#F6C1B2',
}

export enum PlotlyFillTypes {
  ToSelf = 'toself',
  ToZeroY = 'tozeroy',
  ToNextY = 'tonexty',
}

export enum PlotlyHistNormTypes {
  Count = 'count',
  Probability = 'probability',
  ProbabilityDensity = 'probability density',
}

// For graphs that have potentially many lines
export const colorArray: PlotlyTraceColors[] = [
  PlotlyTraceColors.Primary100,
  PlotlyTraceColors.Primary200,
  PlotlyTraceColors.Secondary,
  PlotlyTraceColors.Accent200,
  PlotlyTraceColors.Accent100,
  PlotlyTraceColors.Gold,
  PlotlyTraceColors.CalmingBlue,
  PlotlyTraceColors.SoftPurple,
  PlotlyTraceColors.Turquoise,
  PlotlyTraceColors.SoftBlue,
  PlotlyTraceColors.Lavender,
  PlotlyTraceColors.Orange,
  PlotlyTraceColors.NavyBlue,
  PlotlyTraceColors.Green,
  PlotlyTraceColors.Mint,
  PlotlyTraceColors.BabyBlue,
  PlotlyTraceColors.YellowPantone,
  PlotlyTraceColors.Teal,
  PlotlyTraceColors.RoseGold,
  PlotlyTraceColors.Snow,
  PlotlyTraceColors.Coral,
  PlotlyTraceColors.Pink,
  PlotlyTraceColors.Cream,
  PlotlyTraceColors.Brown,
  PlotlyTraceColors.Purple,
  PlotlyTraceColors.RedRose,
  PlotlyTraceColors.Aquamarine,
  PlotlyTraceColors.Beige,
  PlotlyTraceColors.Magenta,
  PlotlyTraceColors.Burgundy,
  PlotlyTraceColors.Chocolate,
  PlotlyTraceColors.Yellow,
  PlotlyTraceColors.Blond,
  PlotlyTraceColors.Taupe,
  PlotlyTraceColors.Silver,
  PlotlyTraceColors.Blush,
  PlotlyTraceColors.Maroon,
  PlotlyTraceColors.Lilac,
  PlotlyTraceColors.Ochre,
  PlotlyTraceColors.Cyan,
  PlotlyTraceColors.WineRed,
  PlotlyTraceColors.Tulip,
  PlotlyTraceColors.Pearl,
  PlotlyTraceColors.Blue,
  PlotlyTraceColors.Lemon,
  PlotlyTraceColors.Sand,
  PlotlyTraceColors.Cherry,
  PlotlyTraceColors.DarkIndigo,
  PlotlyTraceColors.Olive,
  PlotlyTraceColors.Nude,
  PlotlyTraceColors.SnowBlue,
  PlotlyTraceColors.OrangeRAL,
  PlotlyTraceColors.DarkGold,
  PlotlyTraceColors.GrassGreen,
  PlotlyTraceColors.Rust,
  PlotlyTraceColors.Grape,
  PlotlyTraceColors.Caramel,
  PlotlyTraceColors.Berry,
  PlotlyTraceColors.Coffee,
  PlotlyTraceColors.Khaki,
  PlotlyTraceColors.Champagne,
  PlotlyTraceColors.Mauve,
  PlotlyTraceColors.Cinnamon,
  PlotlyTraceColors.Peach,
  PlotlyTraceColors.Denim,
  PlotlyTraceColors.Indigo,
  PlotlyTraceColors.RetroYellow,
  PlotlyTraceColors.Tan,
  PlotlyTraceColors.Blood,
  PlotlyTraceColors.BlueGreen,
  PlotlyTraceColors.Lime,
  PlotlyTraceColors.Amber,
  PlotlyTraceColors.Earth,
  PlotlyTraceColors.Skin,
  PlotlyTraceColors.Rose,
  PlotlyTraceColors.Pistachio,
  PlotlyTraceColors.Ocean,
  PlotlyTraceColors.Salmon,
];
