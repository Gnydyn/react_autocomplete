import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const initialPerson: Person[] = peopleFromServer.map(person => ({
    ...person,
  }));

  const [isInputFocus, setInputFocus] = useState(false);
  const [person, setPerson] = useState<Person | null>(null);

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const onSelected = (selectedPerson: Person) => {
    setInputFocus(false);
    setPerson(selectedPerson);
    setQuery(selectedPerson.name);
  };

  const normalizedQuery = appliedQuery.toLowerCase();

  const filteredPeople = useMemo(() => {
    return initialPerson.filter(initperson =>
      initperson.name.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {`${person ? `${person?.name} (${person?.born} - ${person?.died})` : 'No selected person'}`}
        </h1>

        <div className={`dropdown ${isInputFocus ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              value={query}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={() => {
                setInputFocus(true);
              }}
              onChange={handleQueryChange}
            />
          </div>
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {(appliedQuery.trim() ? filteredPeople : initialPerson).map(
                pers => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={pers.slug}
                    onClick={() => onSelected(pers)}
                  >
                    <p className="has-text-link">{pers.name}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {filteredPeople.length === 0 && appliedQuery.trim() && (
          <div
            className="
              notification
              is-danger
              is-light
              mt-3
              is-align-self-flex-start
            "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
