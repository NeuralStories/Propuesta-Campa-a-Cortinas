export const validateCIF = (cif: string) => {
  const value = cif.toUpperCase().replace(/[\s-]/g, '');

  // NIF (8 digits + letter)
  if (/^\d{8}[A-Z]$/.test(value)) {
    const number = parseInt(value.slice(0, 8), 10);
    const letter = value[8];
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    return letters[number % 23] === letter;
  }

  // NIE (X/Y/Z + 7 digits + letter)
  if (/^[XYZ]\d{7}[A-Z]$/.test(value)) {
    const replaced = value.replace(/^X/, '0').replace(/^Y/, '1').replace(/^Z/, '2');
    const number = parseInt(replaced.slice(0, 8), 10);
    const letter = replaced[8];
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    return letters[number % 23] === letter;
  }

  // CIF (letter + 7 digits + control)
  if (!/^[A-Z]\d{7}[0-9A-J]$/.test(value)) return false;

  const letra = value[0];
  const numero = value.substring(1, 8);
  const control = value[8];

  let suma = 0;
  for (let i = 0; i < numero.length; i += 1) {
    const digito = parseInt(numero[i], 10);
    if (i % 2 === 0) {
      const doble = digito * 2;
      suma += doble > 9 ? doble - 9 : doble;
    } else {
      suma += digito;
    }
  }

  const unidades = suma % 10;
  const calculado = unidades === 0 ? 0 : 10 - unidades;
  const letrasControl = 'JABCDEFGHI';
  const controlLetra = letrasControl[calculado];
  const controlNumero = calculado.toString();

  const controlSoloNumero = 'ABEH';
  const controlSoloLetra = 'KPQS';

  if (controlSoloNumero.includes(letra)) {
    return control === controlNumero;
  }
  if (controlSoloLetra.includes(letra)) {
    return control === controlLetra;
  }

  return control === controlNumero || control === controlLetra;
};

export const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePhone = (phone: string) => {
  const cleaned = phone.replace(/\s/g, '');
  return /^[6789]\d{8}$/.test(cleaned);
};
