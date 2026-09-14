import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import HomePage from './page';
import AboutPage from './about/page';

vi.mock('@/components/location-map', () => ({
  LocationMap: () => <div role="region" aria-label="Office map" />
}));

describe('public page map placement', () => {
  it('places the locations section between contact and footer on Home', () => {
    const {container} = render(<HomePage />);
    const main = container.querySelector('main');

    expect(main?.children[0]).toHaveAttribute('id', 'contact');
    expect(main?.children[1]).toHaveAttribute('id', 'locations');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('does not render the map on an inner page', () => {
    render(<AboutPage />);

    expect(screen.queryByRole('region', {name: 'Office map'})).not.toBeInTheDocument();
  });
});
