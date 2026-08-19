using System.Text.Json.Serialization;

namespace BuiltWithMaui.Models;

public class AppEntry
{
    [JsonPropertyName("name")] public string Name { get; set; } = "";
    [JsonPropertyName("slug")] public string Slug { get; set; } = "";
    [JsonPropertyName("description")] public string Description { get; set; } = "";
    [JsonPropertyName("users")] public string Users { get; set; } = "";
    [JsonPropertyName("author")] public string Author { get; set; } = "";
    [JsonPropertyName("authorGitHub")] public string AuthorGitHub { get; set; } = "";
    [JsonPropertyName("website")] public string Website { get; set; } = "";
    [JsonPropertyName("links")] public List<AppLink> Links { get; set; } = [];
    [JsonPropertyName("tags")] public List<string> Tags { get; set; } = [];
    [JsonPropertyName("dateAdded")] public string DateAdded { get; set; } = "";
    [JsonPropertyName("featured")] public bool Featured { get; set; }

    public IEnumerable<string> Platforms => Links.Select(l => l.Platform).Distinct();

    public bool HasPlatform(string platform) =>
        Links.Any(l => l.Platform.Equals(platform, StringComparison.OrdinalIgnoreCase));
}

public class AppLink
{
    [JsonPropertyName("platform")] public string Platform { get; set; } = "";
    [JsonPropertyName("url")] public string Url { get; set; } = "";
}
