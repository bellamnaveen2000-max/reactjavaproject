import { useMemo, useState } from "react";

export function useProductFilters(products) {
  const [search, setSearch] = useState("");
  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const minimum = minimumPrice === "" ? Number.NEGATIVE_INFINITY : Number(minimumPrice);
    const maximum = maximumPrice === "" ? Number.POSITIVE_INFINITY : Number(maximumPrice);
    return products.filter((product) => {
      const price = Number(product.price);
      return product.name.toLocaleLowerCase().includes(query) && price >= minimum && price <= maximum;
    });
  }, [maximumPrice, minimumPrice, products, search]);

  return {
    search,
    setSearch,
    minimumPrice,
    setMinimumPrice,
    maximumPrice,
    setMaximumPrice,
    visibleProducts,
  };
}
