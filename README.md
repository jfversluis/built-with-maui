# Built with .NET MAUI

A community showcase of real-world apps built with [.NET MAUI](https://dot.net/maui) — for Android, iOS, macOS, and Windows.

🌐 **Browse the showcase:** https://jfversluis.github.io/built-with-maui/

> [!NOTE]
> This project is unofficial and is not endorsed by Microsoft in any way. For the official Microsoft customer showcases, please go to: https://dotnet.microsoft.com/platform/customers/maui

## Submit your app

Built something with .NET MAUI? **[Submit your app](https://github.com/jfversluis/built-with-maui/issues/new?template=submit-app.yml)** by opening an issue — no PR needed!

1. Fill out the short issue form (name, description, store links).
2. Our bot automatically validates your submission.
3. A maintainer approves it and your app appears on the site. 🎉

## How it works

- App data lives in [`data/apps/`](data/apps) — one JSON file per app.
- The website is a Blazor WebAssembly app in [`src/BuiltWithMaui/`](src/BuiltWithMaui), deployed to GitHub Pages on every merge to `main`.
- To run the site locally: `node scripts/merge-data.mjs && cd src/BuiltWithMaui && dotnet run`.

## Acknowledgements

* iOS, Android and Windows logos from: https://www.svgrepo.com/collection/company-logo/
* Inspired by [Tiny Tool Town](https://github.com/shanselman/TinyToolTown)
