import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth.tsx';
import {
  useAddToWishlistMutation,
  useGetMyWishlistQuery,
  useRemoveFromWishlistMutation,
} from '../redux/housebank.ts';

export default function usePropertyWishlist() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { data: savedProperties = [] } = useGetMyWishlistQuery(undefined, {
    skip: auth.user?.role !== 'customer',
  });
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [busyId, setBusyId] = useState<number | string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSaved = (propertyId: number | string) =>
    savedProperties.some((property: any) => String(property.id) === String(propertyId));

  const toggle = async (propertyId: number | string) => {
    if (!auth.user) {
      navigate('/signin');
      return;
    }
    if (auth.user.role !== 'customer') return;

    setBusyId(propertyId);
    setError(null);
    try {
      if (isSaved(propertyId)) {
        await removeFromWishlist(propertyId).unwrap();
      } else {
        await addToWishlist({ property_id: propertyId }).unwrap();
      }
    } catch {
      setError('Could not update your wishlist. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  return {
    isSaved,
    toggle,
    busyId,
    error,
    canSave: !auth.user || auth.user.role === 'customer',
  };
}