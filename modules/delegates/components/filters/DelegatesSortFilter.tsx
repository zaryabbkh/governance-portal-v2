import useDelegatesFiltersStore, { delegatesSortEnum } from '../../stores/delegatesFiltersStore';
import { ListboxInput, ListboxButton, ListboxPopover, ListboxList, ListboxOption } from '@reach/listbox';
import { Icon } from '@makerdao/dai-ui-icons';

export function DelegatesSortFilter(): JSX.Element {
  const [sort, setSort] = useDelegatesFiltersStore(state => [state.sort, state.setSort]);

  return (
    <ListboxInput onChange={setSort} defaultValue={sort}>
      <ListboxButton
        sx={{ variant: 'listboxes.default.button', fontWeight: 'semiBold', py: [2] }}
        arrow={<Icon name="chevron_down" size={2} />}
      />
      <ListboxPopover sx={{ variant: 'listboxes.default.popover' }}>
        <ListboxList sx={{ variant: 'listboxes.default.list' }}>
          <ListboxOption label="Sort by default" value={delegatesSortEnum.random}>
            Default
          </ListboxOption>
          <ListboxOption label="Sort by GSUp delegated" value={delegatesSortEnum.mkrDelegated}>
            GSUp delegated
          </ListboxOption>
          <ListboxOption label="Sort by creation date" value={delegatesSortEnum.creationDate}>
            Creation date
          </ListboxOption>
        </ListboxList>
      </ListboxPopover>
    </ListboxInput>
  );
}
