export const environment = {
    production: true,
    nisqAnalyzer: window['env']['nisqAnalyzer'] || true,
    NISQ_API_URL:
        window['env']['NISQ_ANALYZER_HOST_NAME'] &&
        window['env']['NISQ_ANALYZER_PORT']
            ? `http://${window['env']['NISQ_ANALYZER_HOST_NAME']}:${window['env']['NISQ_ANALYZER_PORT']}/nisq-analyzer`
            : 'http://localhost:5010/nisq-analyzer',
};
