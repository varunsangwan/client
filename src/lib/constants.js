export const VERSION = '1';

export const BASE_SYMBOL = 'ETH';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export const DEFAULT_CHAIN_ID = 4; // rinkeby

export const PRICE_DECIMALS = 8;
export const LEVERAGE_DECIMALS = 18;

// ABIS
const TRADING_ABI = [

	"function getLatestPrice(address feed, uint16 productId) view returns(uint256)",
	"function getVault() view returns(tuple(uint96 cap, uint96 balance, uint64 staked, uint80 lastCheckpointBalance, uint80 lastCheckpointTime, uint32 stakingPeriod, uint32 redemptionPeriod, uint32 maxDailyDrawdown))",
	"function getProduct(uint16 productId) view returns(tuple(address feed, uint64 maxLeverage, uint16 fee, bool isActive, uint64 maxExposure, uint48 openInterestLong, uint48 openInterestShort, uint16 interest, uint32 settlementTime, uint16 minTradeDuration, uint16 liquidationThreshold, uint16 liquidationBounty))",
	"function getPositions(uint256[] calldata positionIds) view returns(tuple(uint64 productId, uint64 leverage, uint64 price, uint64 margin, address owner, uint80 timestamp, bool isLong, bool isSettling)[] _positions)",
	"function getStakes(uint256[] calldata stakeIds) view returns(tuple(uint64 amount, uint32 timestamp, address owner)[] _stakes)",

	"function stake() payable",
	"function redeem(uint256 stakeId, uint256 amount)",
	"function openPosition(uint16 productId, bool isLong, uint256 leverage) payable",
	"function addMargin(uint256 positionId) payable",
	"function closePosition(uint256 positionId, uint256 margin, bool releaseMargin)",

	"event Staked(uint256 stakeId, address indexed user, uint256 amount)",
	"event Redeemed(uint256 stakeId, address indexed user, uint256 amount, bool isFullRedeem)",
	"event NewPosition(uint256 positionId, address indexed user, uint64 indexed productId, bool isLong, uint256 price, uint256 margin, uint256 leverage)",
	"event AddMargin(uint256 positionId, address indexed user, uint256 margin, uint256 newMargin, uint256 newLeverage)",
	"event ClosePosition(uint256 positionId, address indexed user, bool indexed isFullClose, uint64 indexed productId, uint256 price, uint256 entryPrice, uint256 margin, uint256 leverage, uint256 pnl, bool pnlIsNegative, bool wasLiquidated)",
	"event NewPositionSettled(uint256 positionId, address indexed user, uint256 price)",
	"event PositionLiquidated(uint256 positionId, address indexed by, uint256 vaultReward, uint256 liquidatorReward)"
];

export const PRODUCT_TO_ID = {
	'ETH-USD': 1,
	'BTC-USD': 2,
	'LINK-USD': 3,
	'XRP-USD': 4,
	'Gold': 5,
	'Silver': 6,
	'Oil': 7,
	'EUR-USD': 8,
	'GBP-USD': 9,
	'JPY-USD': 10,
	'CHF-USD': 11,
	'AUD-USD': 12
};

export const CHAIN_DATA = {
	31337: { // Hardhat local node
		id: 31337,
		label: 'Localhost',
		contract: {
			address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
			abi: TRADING_ABI
		},
		products: {
			1: 'ETH-USD',
			2: 'BTC-USD',
			3: 'Gold',
			4: 'EUR-USD'
		},
		explorer: `http://localhost:8545`
	},
	4: {
		id: 4,
		label: 'Rinkeby',
		explorer: 'https://rinkeby.etherscan.io',
		contract: {
			address: '0x71e82EBe9B6F9A844E8003e56ff4e41636066bB6',
			abi: TRADING_ABI
		},
		products: {
			1: 'ETH-USD',
			2: 'BTC-USD',
			3: 'LINK-USD',
			4: 'XRP-USD',
			5: 'Gold',
			6: 'Silver',
			7: 'Oil',
			8: 'EUR-USD',
			9: 'GBP-USD',
			10: 'JPY-USD',
			11: 'CHF-USD',
			12: 'AUD-USD'
		},
		testnet: true
	},
	42161: {
		id: 42161,
		label: 'Arbitrum',
		network: `https://arb1.arbitrum.io/rpc`,
		explorer: 'https://arbiscan.io',
		contract: {
			address: '0x5F2fFc7883BD12604e0adf0403f9436D40386Ef4',
			abi: TRADING_ABI
		},
		products: {
			1: 'ETH-USD',
			2: 'BTC-USD',
			4: 'EUR-USD'
		},
		testnet: true,
		underMaintenance: true
	},
	'xx1': { // Ethereum mainnet
		id: 1,
		label: 'Mainnet',
		explorer: 'https://etherscan.io'
	},
	'xx10': {
		id: 10,
		label: 'Optimism'
	}
}