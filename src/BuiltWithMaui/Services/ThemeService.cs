using Microsoft.JSInterop;

namespace BuiltWithMaui.Services;

public class ThemeService(IJSRuntime js)
{
    public bool IsLight { get; private set; }

    public event Action? OnChange;

    public async Task InitializeAsync()
    {
        IsLight = await js.InvokeAsync<string?>("localStorage.getItem", "theme") == "light";
    }

    public async Task ToggleAsync()
    {
        IsLight = !IsLight;
        await js.InvokeVoidAsync("localStorage.setItem", "theme", IsLight ? "light" : "dark");
        if (IsLight)
            await js.InvokeVoidAsync("document.documentElement.setAttribute", "data-theme", "light");
        else
            await js.InvokeVoidAsync("document.documentElement.removeAttribute", "data-theme");
        OnChange?.Invoke();
    }
}
