import { ethers } from 'ethers'
import { get } from 'svelte/store'

import { CHAIN_DATA, PRICE_DECIMALS, BASE_SYMBOL } from './constants'
import { activateProductPrices } from './helpers'

import { hideMenu } from '../stores/menu'
import { hideModal } from '../stores/modals'
import { products, selectedProductId } from '../stores/products'
import { hideToast } from '../stores/toasts'
import { chainId } from '../stores/wallet'


export function formatUnits(number, units) {
  return ethers.utils.formatUnits(number || 0, units || 8);
}

export function parseUnits(number, units) {
  if (typeof(number) == 'number') {
  	number = number.toFixed(units || 8);
  }
  return ethers.utils.parseUnits(number, units || 8);
}

export function intify(number) {
	if (parseInt(number * 1) == number * 1) return parseInt(number);
	return number;
}

export function shortAddr(_address) {
	if (!_address) return;
	return _address.substring(0,6) + '...' + _address.slice(-4);
}

export function formatToDisplay(amount, maxPrecision) {
	if (isNaN(amount)) return 0;
	if (!maxPrecision) maxPrecision = 100000;

	if ((amount*1 == 0 || amount * 1 >= 1) && (amount * 1).toFixed(3)*1 == Math.round(amount * 1)) return Math.round(amount);
	
	if (amount * 1 >= 1000 || amount * 1 <= -1000) {
		return Math.round(amount*1).toLocaleString();
	} else if (amount * 1 >= 100 || amount * 1 <= -100) {
		return (amount * 1).toFixed(2);
	} else if (amount * 1 >= 10 || amount * 1 <= -10) {
		return (amount * 1).toFixed(Math.min(maxPrecision,3));
	} else if (amount * 1 >= 0.1 || amount * 1 <= -0.1) {
		return (amount * 1).toFixed(Math.min(maxPrecision,5));
	} else {
		return (amount * 1).toFixed(Math.min(maxPrecision,6));
	}
}

export function formatPnl(pnl, pnlIsNegative, isPercent) {
	let string = '';
	if (pnl == undefined) return string;
	if (pnlIsNegative == undefined) {
		pnlIsNegative = pnl < 0;
	}
	if (!pnlIsNegative) {
		string += '+';
	} else if (pnl > 0) {
		string += '-';
	}
	string += formatToDisplay(pnl, isPercent ? 2 : null) || 0;
	return string;
}

export function formatPositions(positions, positionIds) {
	let formattedPositions = [];
	let i = 0;
	for (const p of positions) {
		if (!p.productId || !p.productId.toNumber()) {
			i++;
			continue;
		}
		formattedPositions.push({
			positionId: positionIds[i],
			product: get(products)[p.productId],
			timestamp: p.timestamp,
			isLong: p.isLong,
			isSettling: p.isSettling,
			margin: formatUnits(p.margin),
			leverage: formatUnits(p.leverage),
			amount: formatUnits(p.margin) * formatUnits(p.leverage),
			price: formatUnits(p.price, PRICE_DECIMALS),
			productId: p.productId
		});
		activateProductPrices(p.productId);
		i++;
	}
	formattedPositions.reverse();
	return formattedPositions;
}

export function formatTrades(trades, blockNumber, txHash) {
	let formattedTrades = [];
	for (const t of trades) {
		formattedTrades.push({
			positionId: t.positionId,
			productId: t.productId,
			product: get(products)[t.productId],
			price: formatUnits(t.closePrice || t.price, PRICE_DECIMALS),
			entryPrice: formatUnits(t.entryPrice, PRICE_DECIMALS),
			margin: formatUnits(t.margin),
			leverage: formatUnits(t.leverage),
			amount: formatUnits(t.margin) * formatUnits(t.leverage),
			timestamp: t.timestamp,
			isLong: t.isLong,
			pnl: formatUnits(t.pnl),
			pnlIsNegative: t.pnlIsNegative,
			isFullClose: t.isFullClose,
			wasLiquidated: t.wasLiquidated,
			txHash: t.txHash || t.transactionHash || txHash,
			block: t.blockNumber || blockNumber
		});
	}
	return formattedTrades;
}

export function formatStakes(stakes, stakeIds) {
	let formattedStakes = [];
	let i = 0;
	for (const s of stakes) {
		if (!s.timestamp) continue;
		formattedStakes.push({
			stakeId: stakeIds[i],
			amount: formatUnits(s.amount),
			timestamp: s.timestamp
		});
		i++;
	}
	formattedStakes.reverse();
	return formattedStakes;
}

export function formatVault(v) {
	return {
		symbol: BASE_SYMBOL,
		cap: formatUnits(v.cap),
		balance: formatUnits(v.balance),
		staked: formatUnits(v.staked),
		stakingPeriod: v.stakingPeriod,
		redemptionPeriod: v.redemptionPeriod,
		maxDailyDrawdown: formatUnits(v.maxDailyDrawdown, 2)
	}
}

export function formatProduct(p, productId) {
	return {
		symbol: get(products)[productId],
		maxLeverage: formatUnits(p.maxLeverage),
		maxExposure: formatUnits(p.maxExposure),
		openInterestLong: formatUnits(p.openInterestLong),
		openInterestShort: formatUnits(p.openInterestShort),
		fee: formatUnits(p.fee, 2),
		interest: formatUnits(p.interest, 2),
		feed: p.feed,
		settlementTime: p.settlementTime,
		minTradeDuration: p.minTradeDuration,
		liquidationThreshold: formatUnits(p.liquidationThreshold, 2),
		liquidationBounty: formatUnits(p.liquidationBounty, 2),
		isActive: p.isActive
	}
}

export function formatEvent(ev) {

	if (ev.event == 'ClosePosition') {

		const { positionId, user, productId, price, entryPrice, margin, leverage, pnl, pnlIsNegative, isFullClose, wasLiquidated } = ev.args;

		return {
			type: 'ClosePosition',
			positionId: positionId && positionId.toNumber(),
			product: get(products)[productId],
			price: formatUnits(price, PRICE_DECIMALS),
			entryPrice: formatUnits(entryPrice, PRICE_DECIMALS),
			margin: formatUnits(margin),
			leverage: formatUnits(leverage),
			amount: formatUnits(margin) * formatUnits(leverage),
			pnl: formatUnits(pnl),
			pnlIsNegative,
			isFullClose,
			wasLiquidated,
			txHash: ev.transactionHash,
			block: ev.blockNumber,
			productId: productId
		};

	} else if (ev.event == 'NewPosition') {

		const { positionId, user, productId, price, margin, leverage, isLong } = ev.args;

		return {
			type: 'NewPosition',
			positionId: positionId && positionId.toNumber(),
			product: get(products)[productId],
			price: formatUnits(price, PRICE_DECIMALS),
			margin: formatUnits(margin),
			leverage: formatUnits(leverage),
			amount: formatUnits(margin) * formatUnits(leverage),
			isLong,
			txHash: ev.transactionHash,
			block: ev.blockNumber,
			productId: productId
		}

	} else if (ev.event == 'Staked') {

		const { stakeId, user, amount } = ev.args;

		return {
			type: 'Staked',
			stakeId: stakeId && stakeId.toNumber(),
			amount: formatUnits(amount),
			txHash: ev.transactionHash,
			block: ev.blockNumber
		}

	} else if (ev.event == 'Redeemed') {

		const { stakeId, user, amount, isFullRedeem } = ev.args;

		return {
			type: 'Redeemed',
			stakeId: stakeId && stakeId.toNumber(),
			amount: formatUnits(amount),
			isFullRedeem,
			txHash: ev.transactionHash,
			block: ev.blockNumber
		}

	}

}

export function txLink(hash) {
	const explorer = CHAIN_DATA[get(chainId)]['explorer'];
	return `${explorer}/tx/${hash}`; 
}

export function addrLink(addr) {
	const explorer = CHAIN_DATA[get(chainId)]['explorer'];
	return `${explorer}/address/${addr}`; 
}

export function getCachedLeverage(productId) {
	let cl = localStorage.getItem('cachedLeverages');
	if (cl) {
		try {
			cl = JSON.parse(cl);
			return cl[productId] * 1;
		} catch(e) {}
	} else {
		return null;
	}
}

export function setCachedLeverage(productId, _leverage) {
	let cl = localStorage.getItem('cachedLeverages');
	if (cl) {
		cl = JSON.parse(cl);
		cl[productId] = _leverage * 1;
		localStorage.setItem('cachedLeverages', JSON.stringify(cl));
	} else {
		localStorage.setItem('cachedLeverages', JSON.stringify({[productId]: _leverage}));
	}
}

export function catchLinks(cb) {

	window.addEventListener('click', (ev) => {

      if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.defaultPrevented) {
          return true;
      }
      
      let anchor = null;
      for (let n = ev.target; n.parentNode; n = n.parentNode) {
          if (n.nodeName === 'A') {
              anchor = n;
              break;
          }
      }

      if (!anchor) return true;
      
      let href = anchor.getAttribute('href');
      
      if (!href || href && href.includes('http')) return true;
      
      ev.preventDefault();
      
      cb(href);

      return false;

  });

}

export function hidePopoversOnClick() {

	window.addEventListener('click', (ev) => {

      if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.defaultPrevented) {
          return true;
      }
      
      if (ev.target && ev.target.getAttribute('data-intercept')) return true;

      let interceptor = null;
      for (let n = ev.target; n.parentNode; n = n.parentNode) {
          if (n.getAttribute('data-intercept')) {
              interceptor = true;
              break;
          }
      }

      if (interceptor) return true;

      hideModal();
      hideMenu();

  });

  window.addEventListener('keydown', (ev) => {
  	if (ev.key == 'Escape') {
  		hideModal();
  		hideMenu();
  		hideToast();
  	}
  })

}