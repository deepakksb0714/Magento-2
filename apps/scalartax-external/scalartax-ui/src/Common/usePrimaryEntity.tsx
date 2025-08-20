import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

interface PrimaryEntity {
  id: any;
  name: string;
}

export const usePrimaryEntity = () => {
  const [primaryEntity, setPrimaryEntity] = useState<PrimaryEntity | null>(null);

  const selectEntitiesList = createSelector(
    (state: any) => state.Invoice || {},
    (invoices: any) => ({
      entitiesList: invoices.entitiesList,
    })
  );

  const { entitiesList } = useSelector(selectEntitiesList);

  useEffect(() => {
    if (entitiesList && entitiesList.length > 0) {
      const defaultEntity = entitiesList.find((entity: any) => entity.is_default);
      setPrimaryEntity(defaultEntity || entitiesList[0]);
    } else {
      setPrimaryEntity(null);
    }
  }, [entitiesList]);

  return primaryEntity;
};
