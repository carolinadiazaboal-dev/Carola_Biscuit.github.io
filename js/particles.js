/**
 * particles.js - Sistema de Partículas Decorativas
 * Agrega efectos visuales sutiles de partículas flotantes
 */

class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.particleCount = 30;
        this.init();
    }

    init() {
        // Crear canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particles-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        this.canvas.style.opacity = '0.6';
        
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Crear partículas
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
        
        // Listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Iniciar animación
        this.animate();
        
        console.log('✨ Sistema de partículas inicializado');
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.5 ? 'rgba(255, 105, 180' : 'rgba(255, 20, 147'
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Actualizar posición
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Rebotar en los bordes
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }
            
            // Dibujar partícula
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `${particle.color}, ${particle.opacity})`;
            this.ctx.fill();
            
            // Conectar partículas cercanas
            this.particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 105, 180, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Inicializar solo en desktop para mejor performance
if (window.innerWidth > 768) {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            new ParticleSystem();
        }, 500);
    });
}
