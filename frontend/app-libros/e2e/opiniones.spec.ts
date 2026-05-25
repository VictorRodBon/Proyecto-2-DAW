import { test, expect } from '@playwright/test'

const MOCK_BOOK = {
    key: '/works/OL11326416W',
    title: 'El Señor de los Anillos',
    description: { value: 'Una gran aventura' },
    covers: [12345],
    first_publish_date: '1954-07-29',
    authors: [{ author: { key: '/authors/OL123A' } }],
    subjects: ['Fantasía', 'Aventura'],
}

const MOCK_AUTHOR = { name: 'J.R.R. Tolkien' }

test.describe('flujo de opiniones', () => {
    test.beforeEach(async ({ page }) => {
        await page.route('https://openlibrary.org/**', async (route) => {
            const url = route.request().url()
            if (url.includes('/works/')) {
                await route.fulfill({ json: MOCK_BOOK })
            } else if (url.includes('/authors/')) {
                await route.fulfill({ json: MOCK_AUTHOR })
            } else {
                await route.continue()
            }
        })
    })

    test('usuario puede ver opiniones de un libro', async ({ page }) => {
        await page.goto('/login')
        await page.fill('[data-testid="email"]', 'victorrodbon@gmail.com')
        await page.fill('[data-testid="password"]', 'Victor-2005')
        await page.click('[data-testid="btn-login"]')
        await page.waitForURL('/search')

        await page.goto('/detalle/OL11326416W')
        await page.locator('[data-testid="btn-ver-opiniones"]').click()
        await expect(page.locator('[data-testid="lista-opiniones"]')).toBeVisible()
    })

    test('usuario autenticado puede crear una opinion', async ({ page }) => {
        await page.goto('/login')
        await page.fill('[data-testid="email"]', 'victorrodbon@gmail.com')
        await page.fill('[data-testid="password"]', 'Victor-2005')
        await page.click('[data-testid="btn-login"]')
        await page.waitForURL('/search')

        await page.goto('/addOpinion/OL11326416W')
        await page.fill('[data-testid="valoracion"]', 'Gran libro de prueba')
        await page.locator('[data-testid="puntuacion-rating"] label').nth(4).click()
        await page.click('[data-testid="btn-enviar-opinion"]')
        await expect(page.getByText('Opinión enviada')).toBeVisible()

        await page.goto('/detalle/OL11326416W')
        await page.locator('[data-testid="btn-ver-opiniones"]').click()
        await expect(page.locator('[data-testid="opinion-usuario"]').first()).toContainText(
            'Gran libro de prueba',
        )
    })
})
