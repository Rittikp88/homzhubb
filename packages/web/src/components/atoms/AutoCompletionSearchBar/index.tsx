import React, { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, LayoutChangeEvent } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useTranslation } from 'react-i18next';
import { getDataFromPlaceID } from '@homzhub/web/src/utils/MapsUtils';
import { AddPropertyContext, ILatLng } from '@homzhub/web/src/screens/addProperty/AddPropertyContext';
import { SearchField } from '@homzhub/web/src/components/atoms/SearchField';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import PopupMenuOptions, { IPopupOptions } from '@homzhub/web/src/components/molecules/PopupMenuOptions';
import { AddPropertyStack } from '@homzhub/web/src/screens/addProperty';

const AutoCompletionSearchBar: FC = () => {
  const { t } = useTranslation();
  const [popOverWidth, setPopoverWidth] = useState<string | number>('100%');
  const popupRef = useRef<PopupActions>(null);
  const searchInputRef = useRef<TextInput>(null);
  const [searchText, setSearchText] = useState('');
  const { setUpdatedLatLng, hasScriptLoaded, navigateScreen } = useContext(AddPropertyContext);
  const [suggestions, setSuggestions] = useState<google.maps.places.QueryAutocompletePrediction[]>([]);
  const updateSearchValue = (value: string): void => setSearchText(value);
  const popupOptionStyle = { marginTop: '4px', alignItems: 'stretch', width: popOverWidth };
  const getAutocompleteSuggestions = (query: string): void => {
    if (hasScriptLoaded) {
      const service = new google.maps.places.AutocompleteService();
      service.getQueryPredictions({ input: query }, (result, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          // handle error here
        }
        setSuggestions(result ?? []);
      });
    }
  };
  useEffect(() => {
    if (searchText.length > 0) {
      getAutocompleteSuggestions(searchText);
      if (popupRef && popupRef.current && searchInputRef && searchInputRef.current && suggestions.length > 0) {
        popupRef.current.open();
      }
    } else if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  }, [searchText]);
  const handleSuggestionSelection = (selectedOption: IPopupOptions): void => {
    setSearchText(selectedOption.label);
    if (selectedOption && selectedOption.value) {
      getDataFromPlaceID((selectedOption?.value as string) ?? '', (result) => {
        setUpdatedLatLng({ lat: result.geometry.location.lat(), lng: result.geometry.location.lng() } as ILatLng);
        navigateScreen(AddPropertyStack.PropertyDetailsMapScreen);
      });
    }
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };
  const getAutoCompletionOptions = useCallback(
    (): IPopupOptions[] =>
      suggestions?.map((item) => {
        return {
          label: item.description,
          value: item.place_id,
        };
      }) ?? [],
    [suggestions]
  );
  const onOpenPopover = (): any => {
    if (searchInputRef && searchInputRef.current && suggestions.length > 0) {
      searchInputRef.current.focus();
    }
  };
  const onLayoutChange = (e: LayoutChangeEvent): void => {
    setPopoverWidth(e.nativeEvent.layout.width);
  };
  return (
    <Popover
      forwardedRef={popupRef}
      content={<PopupMenuOptions options={getAutoCompletionOptions()} onMenuOptionPress={handleSuggestionSelection} />}
      popupProps={{
        position: 'bottom left',
        on: [],
        arrow: false,
        contentStyle: popupOptionStyle,
        closeOnDocumentClick: true,
        children: undefined,
        onOpen: onOpenPopover,
      }}
    >
      <SearchField
        forwardRef={searchInputRef}
        placeholder={t('property:searchProject')}
        value={searchText}
        updateValue={updateSearchValue}
        containerStyle={[styles.searchBar]}
        onLayoutChange={onLayoutChange}
      />
    </Popover>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    alignSelf: 'stretch',
    width: '100%',
  },
});

export default AutoCompletionSearchBar;
