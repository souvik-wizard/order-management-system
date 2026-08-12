import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchProductById, selectAllProducts, selectSelectedProduct, selectProductsStatus, selectProductsError } from '@/store/slices/productsSlice';

/**
 * useProducts — convenience hook for reading and fetching products.
 *
 * @param {boolean} [fetchOnMount=false] - Automatically fetch all products when the component mounts.
 * @returns products state
 */
const useProducts = (fetchOnMount = false) => {
  const dispatch = useDispatch();

  const products = useSelector(selectAllProducts);
  const selectedProduct = useSelector(selectSelectedProduct);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    if (fetchOnMount && status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [fetchOnMount, status, dispatch]);

  return {
    products,
    selectedProduct,
    status,
    error,
    isLoading: status === 'loading',
    fetchProducts: (params) => dispatch(fetchProducts(params)),
    fetchProductById: (id) => dispatch(fetchProductById(id)),
  };
};

export default useProducts;
