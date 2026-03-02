export interface ScientificResult {
  result: number | string;
  formula: string;
  parameters: Record<string, number>;
  unit?: string;
  error?: string;
}

export class ScientificCalculator {
  static physicsForce(mass: number, acceleration: number): ScientificResult {
    try {
      const force = mass * acceleration;
      return {
        result: force,
        formula: `F = m * a`,
        parameters: { mass, acceleration, force },
        unit: 'N (Newtons)',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `F = m * a`,
        parameters: { mass, acceleration },
        unit: 'N (Newtons)',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static physicsVelocity(distance: number, time: number): ScientificResult {
    try {
      const velocity = distance / time;
      return {
        result: velocity,
        formula: `v = d / t`,
        parameters: { distance, time, velocity },
        unit: 'm/s',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `v = d / t`,
        parameters: { distance, time },
        unit: 'm/s',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static physicsAcceleration(initialVelocity: number, finalVelocity: number, time: number): ScientificResult {
    try {
      const acceleration = (finalVelocity - initialVelocity) / time;
      return {
        result: acceleration,
        formula: `a = (v_f - v_i) / t`,
        parameters: { initialVelocity, finalVelocity, time, acceleration },
        unit: 'm/s²',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `a = (v_f - v_i) / t`,
        parameters: { initialVelocity, finalVelocity, time },
        unit: 'm/s²',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static physicsKineticEnergy(mass: number, velocity: number): ScientificResult {
    try {
      const kineticEnergy = 0.5 * mass * Math.pow(velocity, 2);
      return {
        result: kineticEnergy,
        formula: `KE = 0.5 * m * v²`,
        parameters: { mass, velocity, kineticEnergy },
        unit: 'J (Joules)',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `KE = 0.5 * m * v²`,
        parameters: { mass, velocity },
        unit: 'J (Joules)',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static physicsPotentialEnergy(mass: number, height: number, gravity: number = 9.81): ScientificResult {
    try {
      const potentialEnergy = mass * gravity * height;
      return {
        result: potentialEnergy,
        formula: `PE = m * g * h`,
        parameters: { mass, height, gravity, potentialEnergy },
        unit: 'J (Joules)',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `PE = m * g * h`,
        parameters: { mass, height, gravity },
        unit: 'J (Joules)',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static physicsWork(force: number, distance: number): ScientificResult {
    try {
      const work = force * distance;
      return {
        result: work,
        formula: `W = F * d`,
        parameters: { force, distance, work },
        unit: 'J (Joules)',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `W = F * d`,
        parameters: { force, distance },
        unit: 'J (Joules)',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static physicsPower(work: number, time: number): ScientificResult {
    try {
      const power = work / time;
      return {
        result: power,
        formula: `P = W / t`,
        parameters: { work, time, power },
        unit: 'W (Watts)',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `P = W / t`,
        parameters: { work, time },
        unit: 'W (Watts)',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static physicsPressure(force: number, area: number): ScientificResult {
    try {
      const pressure = force / area;
      return {
        result: pressure,
        formula: `P = F / A`,
        parameters: { force, area, pressure },
        unit: 'Pa (Pascals)',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `P = F / A`,
        parameters: { force, area },
        unit: 'Pa (Pascals)',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static physicsDensity(mass: number, volume: number): ScientificResult {
    try {
      const density = mass / volume;
      return {
        result: density,
        formula: `ρ = m / V`,
        parameters: { mass, volume, density },
        unit: 'kg/m³',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `ρ = m / V`,
        parameters: { mass, volume },
        unit: 'kg/m³',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static temperatureConversion(value: number, from: 'C' | 'F' | 'K', to: 'C' | 'F' | 'K'): ScientificResult {
    try {
      let result = value;
      
      // Convert to Celsius first
      switch (from) {
        case 'F':
          result = (value - 32) * 5/9;
          break;
        case 'K':
          result = value - 273.15;
          break;
      }
      
      // Convert from Celsius to target
      switch (to) {
        case 'F':
          result = (result * 9/5) + 32;
          break;
        case 'K':
          result = result + 273.15;
          break;
      }
      
      return {
        result,
        formula: `${value}°${from} = ${result}°${to}`,
        parameters: { value, from, to, result },
        unit: `°${to}`,
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `${value}°${from} = ${value}°${to}`,
        parameters: { value, from, to },
        unit: `°${to}`,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static speedOfSound(temperatureC: number, medium: 'air' | 'water' | 'steel'): ScientificResult {
    try {
      let speed = 0;
      
      switch (medium) {
        case 'air':
          speed = 331.3 * Math.sqrt(1 + temperatureC / 273.15);
          break;
        case 'water':
          speed = 1482; // Approximate at 20°C
          break;
        case 'steel':
          speed = 5960; // Approximate
          break;
      }
      
      return {
        result: speed,
        formula: medium === 'air' 
          ? `v = 331.3 * √(1 + T/273.15)` 
          : medium === 'water' 
          ? `v ≈ 1482 m/s` 
          : `v ≈ 5960 m/s`,
        parameters: { temperatureC, medium, speed },
        unit: 'm/s',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: medium === 'air' 
          ? `v = 331.3 * √(1 + T/273.15)` 
          : medium === 'water' 
          ? `v ≈ 1482 m/s` 
          : `v ≈ 5960 m/s`,
        parameters: { temperatureC, medium },
        unit: 'm/s',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static waveFrequency(wavelength: number, velocity: number): ScientificResult {
    try {
      const frequency = velocity / wavelength;
      return {
        result: frequency,
        formula: `f = v / λ`,
        parameters: { wavelength, velocity, frequency },
        unit: 'Hz',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `f = v / λ`,
        parameters: { wavelength, velocity },
        unit: 'Hz',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static opticsRefraction(angleOfIncidence: number, refractiveIndex1: number, refractiveIndex2: number): ScientificResult {
    try {
      const angleOfRefraction = Math.asin(
        (refractiveIndex1 * Math.sin(angleOfIncidence * Math.PI / 180)) / refractiveIndex2
      ) * 180 / Math.PI;
      
      return {
        result: angleOfRefraction,
        formula: `n₁ * sin(θ₁) = n₂ * sin(θ₂)`,
        parameters: { 
          angleOfIncidence, 
          refractiveIndex1, 
          refractiveIndex2, 
          angleOfRefraction 
        },
        unit: 'degrees',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `n₁ * sin(θ₁) = n₂ * sin(θ₂)`,
        parameters: { angleOfIncidence, refractiveIndex1, refractiveIndex2 },
        unit: 'degrees',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static electricityOhmLaw(voltage: number, current: number): ScientificResult {
    try {
      const resistance = voltage / current;
      return {
        result: resistance,
        formula: `R = V / I`,
        parameters: { voltage, current, resistance },
        unit: 'Ω (Ohms)',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `R = V / I`,
        parameters: { voltage, current },
        unit: 'Ω (Ohms)',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static electricityPower(voltage: number, current: number): ScientificResult {
    try {
      const power = voltage * current;
      return {
        result: power,
        formula: `P = V * I`,
        parameters: { voltage, current, power },
        unit: 'W (Watts)',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `P = V * I`,
        parameters: { voltage, current },
        unit: 'W (Watts)',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static chemistryMolarity(soluteMass: number, soluteMolarMass: number, volume: number): ScientificResult {
    try {
      const moles = soluteMass / soluteMolarMass;
      const molarity = moles / volume;
      return {
        result: molarity,
        formula: `M = (mass / molar mass) / volume`,
        parameters: { 
          soluteMass, 
          soluteMolarMass, 
          volume, 
          moles, 
          molarity 
        },
        unit: 'M (mol/L)',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `M = (mass / molar mass) / volume`,
        parameters: { soluteMass, soluteMolarMass, volume },
        unit: 'M (mol/L)',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static gasLaw(initialPressure: number, initialVolume: number, finalPressure: number, temperature: number = 298): ScientificResult {
    try {
      const finalVolume = (initialPressure * initialVolume) / finalPressure;
      return {
        result: finalVolume,
        formula: `P₁V₁ = P₂V₂`,
        parameters: { 
          initialPressure, 
          initialVolume, 
          finalPressure, 
          finalVolume, 
          temperature 
        },
        unit: 'L (Liters)',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `P₁V₁ = P₂V₂`,
        parameters: { initialPressure, initialVolume, finalPressure },
        unit: 'L (Liters)',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static astronomyEscapeVelocity(mass: number, radius: number): ScientificResult {
    try {
      const G = 6.674 * Math.pow(10, -11);
      const escapeVelocity = Math.sqrt((2 * G * mass) / radius);
      return {
        result: escapeVelocity,
        formula: `v = √(2GM/r)`,
        parameters: { mass, radius, escapeVelocity },
        unit: 'm/s',
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `v = √(2GM/r)`,
        parameters: { mass, radius },
        unit: 'm/s',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}