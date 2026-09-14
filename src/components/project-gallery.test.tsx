import { act, fireEvent, render, screen } from "@testing-library/react";
import { ProjectGallery } from "@/components/project-gallery";
import type { ProjectGalleryResult } from "@/sanity/lib/fetch-projects";

const gallery: ProjectGalleryResult = {
  status: "ready",
  projects: [{
    id: "installation",
    title: "Installation project",
    serviceCategory: "machinery-equipment-installation",
    location: "Batam",
    displayOrder: 1,
    featured: true,
    images: [
      { key: "one", alt: "Installation one", asset: { id: "one", url: "/one.jpg", width: 800, height: 600, aspectRatio: 4 / 3 } },
      { key: "two", alt: "Installation two", asset: { id: "two", url: "/two.jpg", width: 800, height: 600, aspectRatio: 4 / 3 } },
    ],
  }],
};

const labels = {
  emptyMessage: "Empty",
  unavailableMessage: "Unavailable",
  previousLabel: "Previous projects",
  nextLabel: "Next projects",
  filtersLabel: "Filter projects",
  allServicesLabel: "All services",
  pauseLabel: "Pause slideshow",
  playLabel: "Play slideshow",
  slideshowLabel: "Project slideshow",
  serviceLabels: {
    "machinery-equipment-installation": "Installation",
    "machinery-equipment-overhauling": "Overhauling",
    epocast: "EPOCAST",
    "laser-alignment-service": "Alignment",
    "in-situ-machining": "Machining",
    "flange-management": "Flange management",
  },
};

function prepareTrack() {
  const track = document.querySelector<HTMLElement>(".project-gallery__track")!;
  const scrollBy = vi.fn();
  const scrollTo = vi.fn();
  Object.defineProperties(track, {
    clientWidth: { configurable: true, value: 1000 },
    scrollWidth: { configurable: true, value: 2400 },
    scrollLeft: { configurable: true, writable: true, value: 0 },
    scrollBy: { configurable: true, value: scrollBy },
    scrollTo: { configurable: true, value: scrollTo },
  });
  return { track, scrollBy, scrollTo };
}

describe("ProjectGallery autoplay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(window, "matchMedia", { configurable: true, value: vi.fn().mockReturnValue({ matches: false }) });
  });

  afterEach(() => vi.useRealTimers());

  it("advances to the next slide every five seconds", () => {
    render(<ProjectGallery gallery={gallery} {...labels} />);
    const { scrollBy } = prepareTrack();

    act(() => vi.advanceTimersByTime(5_000));

    expect(scrollBy).toHaveBeenCalledWith({ left: 720, behavior: "smooth" });
  });

  it("loops back to the first slide after reaching the end", () => {
    render(<ProjectGallery gallery={gallery} {...labels} />);
    const { track, scrollTo } = prepareTrack();
    track.scrollLeft = 1400;

    act(() => vi.advanceTimersByTime(5_000));

    expect(scrollTo).toHaveBeenCalledWith({ left: 0, behavior: "smooth" });
  });

  it("pauses and resumes from an accessible control", () => {
    render(<ProjectGallery gallery={gallery} {...labels} />);
    const { scrollBy } = prepareTrack();

    fireEvent.click(screen.getByRole("button", { name: "Pause slideshow" }));
    act(() => vi.advanceTimersByTime(10_000));
    expect(scrollBy).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Play slideshow" }));
    act(() => vi.advanceTimersByTime(5_000));
    expect(scrollBy).toHaveBeenCalledOnce();
  });

  it("pauses while the gallery is being hovered", () => {
    render(<ProjectGallery gallery={gallery} {...labels} />);
    const { scrollBy } = prepareTrack();
    const galleryRegion = screen.getByRole("region", { name: "Project slideshow" });

    fireEvent.mouseEnter(galleryRegion);
    act(() => vi.advanceTimersByTime(10_000));
    expect(scrollBy).not.toHaveBeenCalled();

    fireEvent.mouseLeave(galleryRegion);
    act(() => vi.advanceTimersByTime(5_000));
    expect(scrollBy).toHaveBeenCalledOnce();
  });

  it("does not autoplay when reduced motion is requested", () => {
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
    render(<ProjectGallery gallery={gallery} {...labels} />);
    const { scrollBy } = prepareTrack();

    act(() => vi.advanceTimersByTime(10_000));

    expect(scrollBy).not.toHaveBeenCalled();
  });
});
