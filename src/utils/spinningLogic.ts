// Clean spinning logic for the wheel - built from scratch
export interface SpinningState {
  // Cumulative rotation (never resets)
  totalRotation: number;
  // Current visual position (0-360°)
  currentVisualPosition: number;
  // Current color based on visual position
  currentColor: 'ORANGE' | 'PINK' | 'GREEN';
}

export interface SpinResult {
  // CSS rotation for the wheel image
  cssRotation: number;
  // Final visual position (0-360°)
  finalVisualPosition: number;
  // Final color the pointer will land on
  finalColor: 'ORANGE' | 'PINK' | 'GREEN';
  // Number of full rotations
  fullRotations: number;
  // Random offset applied
  randomOffset: number;
}

// Color sector definitions (matching the ACTUAL wheel image)
const COLOR_SECTORS = [
  { start: 0, end: 120, color: 'GREEN' as const },    // 0°-120° = GREEN (at top)
  { start: 121, end: 240, color: 'PINK' as const },   // 121°-240° = PINK (at right)
  { start: 241, end: 360, color: 'ORANGE' as const }  // 241°-360° = ORANGE (at left)
];

// Get color at a specific angle
function getColorAtAngle(angle: number): 'ORANGE' | 'PINK' | 'GREEN' {
  const normalizedAngle = ((angle % 360) + 360) % 360;
  
  for (const sector of COLOR_SECTORS) {
    if (normalizedAngle >= sector.start && normalizedAngle <= sector.end) {
      return sector.color;
    }
  }
  
  // Handle edge case at 0°
  return 'ORANGE';
}

// Get the center angle of a color sector
function getColorSectorCenter(targetColor: 'ORANGE' | 'PINK' | 'GREEN'): number {
  const sector = COLOR_SECTORS.find(s => s.color === targetColor);
  if (!sector) throw new Error(`Invalid color: ${targetColor}`);
  
  return (sector.start + sector.end) / 2;
}

// Calculate the shortest clockwise path from current to target
function calculateClockwisePath(currentAngle: number, targetAngle: number): number {
  let path = targetAngle - currentAngle;
  
  // Ensure we go clockwise (positive rotation)
  if (path <= 0) {
    path += 360;
  }
  
  return path;
}

// Main spinning logic
export function calculateSpin(
  currentState: SpinningState,
  targetColor: 'ORANGE' | 'PINK' | 'GREEN'
): SpinResult {
  console.log('🎯 SPIN CALCULATION START');
  console.log('📊 Current State:', {
    totalRotation: currentState.totalRotation,
    currentVisualPosition: currentState.currentVisualPosition,
    currentColor: currentState.currentColor
  });
  console.log('🎯 Target Color:', targetColor);
  
  // Get target sector center
  const targetSectorCenter = getColorSectorCenter(targetColor);
  console.log('🎯 Target Sector Center:', targetSectorCenter + '°');
  
  // Add random offset (±10°)
  const randomOffset = (Math.random() - 0.5) * 20;
  const finalTarget = targetSectorCenter + randomOffset;
  console.log('🎯 Random Offset:', randomOffset.toFixed(1) + '°');
  console.log('🎯 Final Target (before clamping):', finalTarget.toFixed(1) + '°');
  
  // Ensure final target stays within the color sector
  const sector = COLOR_SECTORS.find(s => s.color === targetColor);
  if (sector) {
    const clampedTarget = Math.max(sector.start + 5, Math.min(sector.end - 5, finalTarget));
    if (clampedTarget !== finalTarget) {
      console.log('🔒 Clamped target to stay within sector bounds');
      console.log('🔒 Original:', finalTarget.toFixed(1) + '° → Clamped:', clampedTarget.toFixed(1) + '°');
    }
    console.log('🎯 Final Target (after clamping):', clampedTarget.toFixed(1) + '°');
  }
  
  // Calculate required rotation to reach target from current position
  const requiredRotation = calculateClockwisePath(currentState.currentVisualPosition, finalTarget);
  console.log('🎯 Required Rotation Calculation:');
  console.log('  Current Position:', currentState.currentVisualPosition.toFixed(1) + '°');
  console.log('  Target Position:', finalTarget.toFixed(1) + '°');
  console.log('  Direct Path:', (finalTarget - currentState.currentVisualPosition).toFixed(1) + '°');
  console.log('  Clockwise Path:', requiredRotation.toFixed(1) + '°');
  
  // Add 6-8 full rotations
  const fullRotations = 6 + Math.floor(Math.random() * 3); // 6, 7, or 8
  const fullRotationsDegrees = fullRotations * 360;
  console.log('🎯 Full Rotations:', fullRotations + ' × 360° = ' + fullRotationsDegrees + '°');
  
  const totalAdditionalRotation = fullRotationsDegrees + requiredRotation;
  console.log('🎯 Total Additional Rotation:', fullRotationsDegrees + '° + ' + requiredRotation.toFixed(1) + '° = ' + totalAdditionalRotation.toFixed(1) + '°');
  
  // Calculate new total rotation by adding to current
  const newTotalRotation = currentState.totalRotation + totalAdditionalRotation;
  console.log('🎯 New Total Rotation Calculation:');
  console.log('  Current Total:', currentState.totalRotation.toFixed(1) + '°');
  console.log('  Additional:', totalAdditionalRotation.toFixed(1) + '°');
  console.log('  New Total:', newTotalRotation.toFixed(1) + '°');
  
  // Calculate final visual position
  const finalVisualPosition = finalTarget;
  console.log('🎯 Final Visual Position:', finalVisualPosition.toFixed(1) + '°');
  
  // Calculate CSS rotation (for the transform)
  const cssRotation = newTotalRotation;
  console.log('🎯 CSS Rotation:', cssRotation.toFixed(1) + '°');
  
  // Verify the result
  const finalColor = getColorAtAngle(finalVisualPosition);
  const isCorrect = finalColor === targetColor;
  
  console.log('🎯 SPIN CALCULATION COMPLETE');
  console.log('📊 Final Result:', {
    cssRotation: cssRotation.toFixed(1) + '°',
    finalVisualPosition: finalVisualPosition.toFixed(1) + '°',
    finalColor,
    targetColor,
    isCorrect: isCorrect ? '✅' : '❌',
    fullRotations,
    randomOffset: randomOffset.toFixed(1) + '°',
    requiredRotation: requiredRotation.toFixed(1) + '°',
    totalRotation: newTotalRotation.toFixed(1) + '°'
  });
  
  if (!isCorrect) {
    console.error('🚨 CRITICAL ERROR: Final color does not match target!');
  }
  
  return {
    cssRotation,
    finalVisualPosition,
    finalColor,
    fullRotations,
    randomOffset
  };
}

// Update state after spin completes
export function updateStateAfterSpin(
	spinResult: SpinResult
): SpinningState {
  return {
    totalRotation: spinResult.cssRotation,
    currentVisualPosition: spinResult.finalVisualPosition,
    currentColor: spinResult.finalColor
  };
}
