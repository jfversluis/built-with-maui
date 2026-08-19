using System.Net.Http.Json;
using BuiltWithMaui.Models;

namespace BuiltWithMaui.Services;

public class AppDataService(HttpClient http)
{
    private List<AppEntry>? _cache;

    public async Task<List<AppEntry>> GetAppsAsync()
    {
        _cache ??= await http.GetFromJsonAsync<List<AppEntry>>("data/apps.json") ?? [];
        return _cache;
    }

    public async Task<AppEntry?> GetAppAsync(string slug) =>
        (await GetAppsAsync()).FirstOrDefault(a =>
            a.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));
}
