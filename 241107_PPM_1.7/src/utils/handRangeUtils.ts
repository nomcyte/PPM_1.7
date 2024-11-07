export const formatRanges = (actions: { action: string; position: string | null; hands: string[] }[]): string => {
  // Early return if actions is not valid
  if (!actions || !Array.isArray(actions)) {
    return 'No ranges defined';
  }

  // Filter out invalid actions and ensure all required properties exist
  const validActions = actions.filter(action => 
    action && 
    typeof action === 'object' && 
    'action' in action && 
    'position' in action && 
    'hands' in action &&
    Array.isArray(action.hands)
  );

  if (validActions.length === 0) {
    return 'No ranges defined';
  }

  // Group hands by action and position
  const groupedActions = validActions.reduce<Record<string, Set<string>>>((acc, action) => {
    const key = `${action.action} ${action.position}`;
    if (!acc[key]) {
      acc[key] = new Set<string>();
    }
    action.hands.forEach(hand => {
      if (typeof hand === 'string') {
        acc[key].add(hand);
      }
    });
    return acc;
  }, {});

  // Format the grouped hands
  return Object.entries(groupedActions)
    .map(([key, handsSet]) => {
      const hands = Array.from(handsSet);
      const { pairs, suited, offsuit } = categorizeHands(hands);
      
      const formattedRanges = [
        pairs.length > 0 ? `<span class="text-red-600">Pairs: ${pairs.join(', ')}</span>` : '',
        suited.length > 0 ? `<span class="text-blue-600">Suited: ${suited.join(', ')}</span>` : '',
        offsuit.length > 0 ? `<span class="text-green-600">Offsuit: ${offsuit.join(', ')}</span>` : '',
      ].filter(Boolean).join('<br>');

      return `<div class="mb-4">
        <div class="font-bold mb-2">${key}</div>
        <div class="pl-4">${formattedRanges || 'No hands selected'}</div>
      </div>`;
    })
    .join('');
};

export const categorizeHands = (hands: string[]): { pairs: string[], suited: string[], offsuit: string[] } => {
  const pairs: string[] = [];
  const suited: string[] = [];
  const offsuit: string[] = [];

  hands.forEach(hand => {
    if (typeof hand !== 'string') return;
    
    if (hand[0] === hand[1]) {
      pairs.push(hand.slice(0, 2));
    } else if (hand.endsWith('s')) {
      suited.push(hand.slice(0, -1));
    } else if (hand.endsWith('o')) {
      offsuit.push(hand.slice(0, -1));
    }
  });

  return { pairs, suited, offsuit };
};

export const compressHandRange = (hands: string[]): string[] => {
  if (!Array.isArray(hands) || hands.length === 0) return [];

  const rankOrder = '23456789TJQKA';
  const sortedHands = [...new Set(hands)].sort((a, b) => {
    if (typeof a !== 'string' || typeof b !== 'string') return 0;
    const aRank1 = rankOrder.indexOf(a[0]);
    const bRank1 = rankOrder.indexOf(b[0]);
    if (aRank1 !== bRank1) return bRank1 - aRank1;
    return rankOrder.indexOf(b[1]) - rankOrder.indexOf(a[1]);
  });

  const compressed: string[] = [];
  let start = sortedHands[0];
  let prev = start;

  for (let i = 1; i <= sortedHands.length; i++) {
    const current = sortedHands[i];
    if (current && current[0] === prev[0] && rankOrder.indexOf(current[1]) === rankOrder.indexOf(prev[1]) - 1) {
      prev = current;
    } else {
      compressed.push(start === prev ? start : `${start}-${prev}`);
      start = current;
      prev = current;
    }
  }

  return compressed;
};