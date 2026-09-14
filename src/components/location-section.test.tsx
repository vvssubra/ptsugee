import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import {LocationSection} from './location-section';

vi.mock('./location-map', () => ({
  LocationMap: ({selectedOfficeId}: {selectedOfficeId: string}) => (
    <div role="region" aria-label="Office map" data-selected-office={selectedOfficeId} />
  )
}));

describe('LocationSection', () => {
  it('renders English office details and safe directions fallbacks', () => {
    render(<LocationSection locale="en" />);

    expect(screen.getByRole('heading', {name: 'Our Locations'})).toBeInTheDocument();
    expect(screen.getByText('164 Tuas South Ave 2, West Point Biz Hub, Singapore')).toBeInTheDocument();
    expect(screen.getByText('Approximate location')).toBeInTheDocument();
    expect(screen.getByText(/© OpenStreetMap contributors/)).toBeInTheDocument();

    for (const link of screen.getAllByRole('link', {name: 'Get directions'})) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('renders equivalent Bahasa Indonesia labels', () => {
    render(<LocationSection locale="id" />);

    expect(screen.getByRole('heading', {name: 'Lokasi Kami'})).toBeInTheDocument();
    expect(screen.getByText('Lokasi perkiraan')).toBeInTheDocument();
    expect(screen.getAllByRole('link', {name: 'Petunjuk arah'})).toHaveLength(2);
  });

  it('focuses the matching map marker when an office card is selected', async () => {
    const user = userEvent.setup();
    render(<LocationSection locale="en" />);

    await user.click(screen.getByRole('button', {name: 'Show Batam office on map'}));

    expect(screen.getByRole('region', {name: 'Office map'})).toHaveAttribute(
      'data-selected-office',
      'batam'
    );
  });
});
