const simpleFilter = (q: string, i: string) => {
  if (q === "") return true;

  const query = q.toLowerCase();
  const item = i.toLowerCase();

  return item.indexOf(query) !== -1;
};

export default simpleFilter;
