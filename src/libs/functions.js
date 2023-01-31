export const getFormatDate = (dateString) => {
  let date = new Date(dateString);
  let months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio ",
    "julio ",
    "agosto ",
    "septiembre ",
    "octubre ",
    "oviembre ",
    "diciembre",
  ];
  return (
    date.getDate() +
    " de " +
    months[date.getMonth()] +
    " de " +
    date.getFullYear()
  );
};
