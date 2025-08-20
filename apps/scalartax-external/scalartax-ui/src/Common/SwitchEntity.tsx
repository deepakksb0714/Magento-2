import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEntities as onGetEntities,
  switchEntity as onSwitchEntity,
} from '../slices/thunk';

interface Entity {
  id: any;
  name: string;
  parent_entity_id: string | null;
  created_at: string;
  is_default: boolean;
}

const SwitchEntity = () => {
  const dispatch = useDispatch();
  const rep = useSelector((state: any) => state.Invoice); // Directly use `useSelector` here
  const [entities, setEntities] = useState<Entity[]>([]);
  const entitiesList = useSelector((state: any) => state.Invoice.entitiesList); // Directly use `useSelector` here
  const [primaryEntityName, setPrimaryEntityName] = useState<string | null>(
    null
  );
  const [primeId, setPrimeId] = useState<string>('');

  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    dispatch(onGetEntities());
  }, [dispatch]);

  useEffect(() => {
    window.sessionStorage.setItem('entity', primeId);
  }, [primeId]);


  useEffect(() => {
    if (entitiesList) {
      try {
        if (!Array.isArray(entitiesList)) {
          console.error('entitiesList is not an array:', entitiesList);
          return;
        }
  
        // Filter out inactive entities
        const activeEntities = entitiesList.filter(entity => entity.status === 'active' || entity.status === 'default');
        setEntities(activeEntities);
  
        const defaultEntity = activeEntities.find((entity) => entity.is_default);
        if (defaultEntity) {
          setPrimaryEntityName(defaultEntity.name);
          window.sessionStorage.setItem('entity', defaultEntity.id);
          setPrimeId(defaultEntity.id);
        } else if (activeEntities.length > 0) {
          setPrimaryEntityName(activeEntities[0].name);
          window.sessionStorage.setItem('entity', activeEntities[0].id);
          setPrimeId(activeEntities[0].id);
        }
      } catch (error) {
        console.error('Error processing entitiesList:', error);
      }
    }
  }, [entitiesList]);

  const handleSelectEntity = async (entity: Entity) => {
    const updatedEntityData = {
      entity: {
        id: entity.id,
        is_default: true,
      },
    };

    // Dispatch update for selected entity
    try {
      await dispatch(onSwitchEntity(updatedEntityData));

      const updatedEntities = entities.map((e) => ({
        ...e,
        is_default: e.id === entity.id,
      }));
      setEntities(updatedEntities);
      setPrimaryEntityName(entity.name);
      setPrimeId(entity.id);
      handleRefresh();
    } catch (error) {
      console.error('Error updating entity:', error);
    }
  };

  return (
    <React.Fragment>
      <Dropdown className="header-item">
        <div>
          <span style={{ fontSize: '18px' }} className="mr-2">
            {primaryEntityName}
          </span>
          <Dropdown.Toggle
            type="button"
            className="btn bg-transparent border-0 arrow-none"
            id="page-header-user-dropdown"
          >
            <span
              style={{ color: 'red', fontSize: '15px' }}
              className="flex items-center"
            >
              Switch Entity
            </span>
          </Dropdown.Toggle>
        </div>

        <Dropdown.Menu className="dropdown-menu-end">
          {entities.length > 0 ? (
            entities.map((entity) => (
              <Dropdown.Item
                key={entity.id}
                className="dropdown-item"
                onClick={() => handleSelectEntity(entity)}
              >
                {entity.name}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item className="dropdown-item text-center" href="#">
              No entities available
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  );
};

export default SwitchEntity;
